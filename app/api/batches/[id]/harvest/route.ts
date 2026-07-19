import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus, Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

// 1. Validate Schema bằng Zod cho dữ liệu đầu vào
const harvestSchema = z.object({
  expiryDate: z.coerce.date({ message: "Ngày hết hạn không hợp lệ!" }),
  retailCompanyId: z.string().min(1, "Vui lòng chọn siêu thị nhận hàng!"),
  ipfsHash: z.string().min(1, "Vui lòng nhập IPFS Hash!"),
});

export const POST = withRole(Role.FARMER, async (req, user, context) => {
  try {
    // A. Lấy batchId từ URL params
    const { id } = await context.params;

    // B. Đọc và validate dữ liệu body gửi lên
    const body = await req.json();
    const validation = harvestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Bước 1: Kiểm tra xem lô hàng (Batch) này có tồn tại hay không
    const batch = await prisma.batch.findUnique({
      where: { id }
    });

    if (!batch) {
      throw new Error("Cannot find batch with the provided ID.");
    }

    if (batch.farmerId !== user.id) {
      throw new Error("You have no permission to interact with this batch!");
    }

    if (batch.status !== BatchStatus.PLANTED) {
      throw new Error(`Cannot add harvest information to batch with status: ${batch.status}`);
    }

    const harvest = await prisma.batch.update({
      where: { id },
      data: {
        ...data,
        status: BatchStatus.HARVESTED,
        harvestDate: new Date(),
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ghi nhật ký canh tác thành công và đã được xác thực mã Hash.",
        data: harvest
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
})