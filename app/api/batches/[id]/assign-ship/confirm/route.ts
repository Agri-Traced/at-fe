import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus, Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

// 1. Validate Schema bằng Zod cho dữ liệu đầu vào
const confirmSchema = z.object({
  shipTxHash: z.string().min(1, "Vui lòng nhập Transaction Hash!"),
});

export const POST = withRole(Role.RETAILER, async (req, user, context) => {
  try {
    // A. Lấy batchId từ URL params
    const { id } = await context.params;

    // B. Đọc và validate dữ liệu body gửi lên
    const body = await req.json();
    const validation = confirmSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Bước 1: Kiểm tra xem lô hàng (Batch) này có tồn tại hay không
    const batch = await prisma.batch.findUnique({
      where: { id }
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Cannot find batch with the provided ID." },
        { status: 404 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { company: true }
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "Cannot find user data." },
        { status: 404 }
      );
    }

    if (batch.retailCompanyId !== userData.company.id) {
      return NextResponse.json(
        { success: false, error: "You have no permission to interact with this batch!" },
        { status: 403 }
      );
    }

    if (batch.shipTxHash !== null) {
      return NextResponse.json(
        { success: false, error: "This batch has already been assigned to a shipper." },
        { status: 400 }
      );
    }

    const txHash = await prisma.batch.update({
      where: { id },
      data,
    });

    return NextResponse.json(
      {
        success: true,
        data: txHash
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      },
      { status: 500 }
    );
  }
})