import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus, Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

// 1. Validate Schema bằng Zod cho dữ liệu đầu vào
const harvestSchema = z.object({
  expiryDate: z.coerce.date({ message: "Ngày hết hạn không hợp lệ!" }),
  retailCompanyId: z.string().min(1, "Vui lòng chọn siêu thị nhận hàng!"),
  quantity: z.number().min(1, "Số lượng sản phẩm không hợp lệ!"),
});

export const POST = withRole(Role.FARMER, async (req, user, context) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validation = harvestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: z.treeifyError(validation.error) },
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

    if (batch.farmerId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You have no permission to interact with this batch!" },
        { status: 403 }
      );
    }

    if (batch.retailTxHash !== null) {
      return NextResponse.json(
        { success: false, error: "This batch has already been harvested." },
        { status: 400 }
      );
    }

    const templateSteps = await prisma.processTemplate.findMany({
      where: { type: 'RETAILER' },
      include: { steps: true }
    });

    await prisma.qualityTest.create({
      data: {
        batchId: batch.id,
        steps: {
          create: templateSteps.flatMap((processTemplate) =>
            processTemplate.steps.map(({ id, processTemplateId, ...step }) => (step))
          ),
        },
      },
    });

    const harvest = await prisma.batch.update({
      where: { id },
      data: {
        ...data,
        harvestDate: new Date(),
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: harvest
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