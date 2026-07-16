import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 1. Định nghĩa Schema validate bằng Zod khớp hoàn toàn với Prisma Model của bạn
const qualitySchema = z.object({
  batchId: z.uuid("Batch ID không hợp lệ (Phải là dạng UUID)"),
  retailerId: z.uuid("Retailer ID không hợp lệ (Phải là dạng UUID)"),
  txHash: z.string().min(1, "Thiếu mã giao dịch Blockchain (TxHash)"),
  isPassed: z.boolean(),
  note: z.string().optional().nullable()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = qualitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        errors: z.treeifyError(validation.error)
      }, { status: 400 });
    }

    const { batchId, retailerId, txHash, isPassed, note } = validation.data;

    // 2. Chạy transaction bảo mật để kiểm tra và lưu trữ duy nhất một lần
    const result = await prisma.$transaction(async (tx) => {

      // Bước A: Kiểm tra Batch có tồn tại trong hệ thống không
      const batch = await tx.batch.findUnique({
        where: { id: batchId }
      });

      if (!batch) {
        throw new Error("Lô hàng không tồn tại trên hệ thống!");
      }

      // Bước B: Chốt chặn bất biến (Bảo vệ dữ liệu không bị ghi đè)
      // Nếu đã có QualityTest ứng với batchId này -> Từ chối xử lý
      const existingTest = await tx.qualityTest.findUnique({
        where: { batchId: batchId }
      });

      if (existingTest) {
        throw new Error("Kết quả kiểm định của lô hàng này đã tồn tại và không thể sửa đổi!");
      }

      // Bước C: Tạo mới bản ghi QualityTest độc lập (Không cập nhật Batch status)
      const newQualityTest = await tx.qualityTest.create({
        data: {
          batchId,
          retailerId,
          txHash,
          isPassed,
          note
        }
      });

      return newQualityTest;
    });

    return NextResponse.json({
      success: true,
      message: "Kết quả kiểm định đã được khóa vĩnh viễn trên hệ thống.",
      data: result
    }, { status: 201 });

  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }, { status: 500 });
  }
}