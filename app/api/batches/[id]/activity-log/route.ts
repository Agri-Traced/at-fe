import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus } from '@/generated/prisma/enums';

// 1. Validate Schema bằng Zod cho dữ liệu đầu vào
const activitySchema = z.object({
  description: z.string().min(1, "Vui lòng nhập mô tả hoạt động canh tác (ví dụ: Bón phân đợt 1)"),
  txHash: z.string().min(1, "Thiếu mã giao dịch Blockchain (txHash)")
});

interface RouteParams {
  params: {
    id: string; // Đây chính là [id] của Batch từ URL
  };
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    // A. Lấy batchId từ URL params
    const { id: batchId } = params;

    // B. Đọc và validate dữ liệu body gửi lên
    const body = await req.json();
    const validation = activitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { description, txHash } = validation.data;

    // C. Sử dụng Prisma Transaction để thực hiện kiểm tra và ghi dữ liệu an toàn
    const result = await prisma.$transaction(async (tx) => {

      // Bước 1: Kiểm tra xem lô hàng (Batch) này có tồn tại hay không
      const batch = await tx.batch.findUnique({
        where: { id: batchId }
      });

      if (!batch) {
        throw new Error("Không tìm thấy lô hàng tương ứng trên hệ thống!");
      }

      // Bước 2: Chặn thêm nhật ký nếu lô hàng đã hoàn thành vòng đời (Đã đem đi bán lẻ hoặc bị hủy)
      if (batch.status !== BatchStatus.PLANTED) {
        throw new Error(`Lô hàng xuất đi: ${batch.status}. Không thể bổ sung nhật ký canh tác.`);
      }

      // Bước 3: Tạo mới bản ghi ActivityLog gắn liền với Batch ID lấy từ URL
      const newActivity = await tx.activityLog.create({
        data: {
          batchId,
          description,
          txHash
        }
      });

      return newActivity;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ghi nhật ký canh tác thành công và đã được xác thực mã Hash.",
        data: result
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("❌ Lỗi API ActivityLog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      },
      { status: 500 }
    );
  }
}