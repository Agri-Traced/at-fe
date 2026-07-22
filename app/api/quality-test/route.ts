import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus, Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

const qualityTestSchema = z.object({
  batchId: z.uuid("Batch ID not valid"),
  isPassed: z.boolean(),
});

export const POST = withRole(Role.RETAILER, async (req, user, context) => {
  try {
    const body = await req.json();
    const validation = qualityTestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error }, { status: 400 });
    }

    const data = validation.data;

    const batch = await prisma.batch.findUnique({
      where: { id: data.batchId },
      include: { qualityTest: true }
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, error: "Cannot find batch with the provided ID." },
        { status: 404 }
      );
    }

    if (batch.qualityTest && batch.qualityTest.txHash !== null) {
      return NextResponse.json(
        { success: false, error: "This batch has already been quality tested." },
        { status: 400 }
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

    if (batch.retailCompanyId !== userData?.company.id) {
      return NextResponse.json(
        { success: false, error: "You have no permission to interact with this batch!" },
        { status: 403 }
      );
    }

    const qualityTest = await prisma.qualityTest.create({ data: { ...data, retailerId: user.id } });

    return NextResponse.json({ success: true, data: { ...qualityTest, blockchainId: batch.blockchainId } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
})