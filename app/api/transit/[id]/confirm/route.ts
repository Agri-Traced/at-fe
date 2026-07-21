import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

const confirmSchema = z.object({
  txHash: z.string().min(1, "Vui lòng nhập Transaction Hash!"),
});

export const POST = withRole(Role.SHIPPER, async (req, user, context) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validation = confirmSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data;

    const transit = await prisma.stepTransit.findUnique({
      where: { id }
    });

    if (!transit) {
      return NextResponse.json(
        { success: false, error: "Cannot find transit with the provided ID." },
        { status: 404 }
      );
    }

    if (transit.shipperId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You have no permission to interact with this batch!" },
        { status: 403 }
      );
    }

    if (transit.txHash !== null) {
      return NextResponse.json(
        { success: false, error: "This transit has already been confirmed." },
        { status: 400 }
      );
    }

    const txHash = await prisma.stepTransit.update({
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