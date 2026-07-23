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

    const activity = await prisma.activity.findFirst({
      where: { batchId: batch.id },
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: "Cannot find activity for this batch." },
        { status: 404 }
      );
    }

    const steps = await prisma.activityStep.findMany({
      where: { activityId: activity.id },
    });

    if (steps.length === 0) {
      return NextResponse.json(
        { success: false, error: "No steps found for this activity." },
        { status: 404 }
      );
    }

    if (steps.some(step => step.values === null || step.values === undefined && step.isRequired === true)) {
      return NextResponse.json(
        { success: false, error: "All required steps must be completed before harvesting." },
        { status: 400 }
      );
    }

    const activityDataAFter = await prisma.activity.findFirst({
      where: { batchId: batch.id },
      include: { steps: true }
    });


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
        data: { ...harvest, activity: activityDataAFter }
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