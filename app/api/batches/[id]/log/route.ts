import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus, Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

const activitySchema = z.object({
  description: z.string().min(1, "Vui lòng nhập mô tả hoạt động canh tác (ví dụ: Bón phân đợt 1)"),
});

export const POST = withRole(Role.FARMER, async (req, user, context) => {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const validation = activitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error },
        { status: 400 }
      );
    }

    const { description } = validation.data;

    const batch = await prisma.batch.findUnique({
      where: { id }
    });

    if (!batch) {
      throw new Error("Không tìm thấy lô hàng tương ứng trên hệ thống!");
    }

    if (batch.farmerId !== user.id) {
      throw new Error("You have no permission to interact with this batch!");
    }

    if (batch.status !== BatchStatus.PLANTED) {
      throw new Error(`Cannot add activity log to batch with status: ${batch.status}`);
    }

    const log = await prisma.activity.create({
      data: {
        batchId: id,
        description,
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ghi nhật ký canh tác thành công và đã được xác thực mã Hash.",
        data: log
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