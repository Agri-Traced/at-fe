import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRole } from '@/lib/auth';
import { Role } from '@/generated/prisma/enums';

const transitSchema = z.object({
  batchId: z.uuid("Batch ID not valid"),
  toLocation: z.string().min(1, "Missing destination location"),
  temperature: z.number().min(-273.15, "Temperature must be a valid Celsius value"),
  humidity: z.number().min(0).max(100),
  vehicleNumber: z.string().min(1, "Missing vehicle number"),
});

export const POST = withRole(Role.SHIPPER, async (req, user, context) => {
  try {
    const body = await req.json();
    const validation = transitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error }, { status: 400 });
    }

    const data = validation.data;

    const batch = await prisma.batch.findUnique({
      where: { id: data.batchId }
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
        { success: false, error: "Cannot find shipper user data." },
        { status: 404 }
      );
    }

    if (batch.shipperCompanyId !== userData?.company.id) {
      return NextResponse.json(
        { success: false, error: "You have no permission to interact with this batch!" },
        { status: 403 }
      );
    }

    const transitHistory = await prisma.stepTransit.findMany({
      where: { batchId: data.batchId },
      orderBy: { departureTime: 'desc' },
      take: 1,
    });

    const fromLocation = transitHistory.length > 0 ? transitHistory[0].toLocation : userData.company.location;

    const transitLog = await prisma.stepTransit.create({ data: { ...data, fromLocation, shipperId: user.id } });

    return NextResponse.json({ success: true, data: { ...transitLog, blockchainId: batch.blockchainId } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
})