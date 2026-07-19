import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRole } from '@/lib/auth';
import { BatchStatus } from '@/generated/prisma/client';

const batchCreate = z.object({
  blockchainId: z.string().min(1, "Missing Blockchain ID"),
  productName: z.string().min(1, "Missing Product Name"),
  category: z.enum(["VEGETABLE", "FRUIT", "GRAIN", "BEAN", "HERB", "OTHER"]),
  unit: z.string().min(1, "Missing Unit"),
  minTemperature: z.number().min(-100).max(100),
  maxTemperature: z.number().min(-100).max(100),
  minHumidity: z.number().min(0).max(100),
  maxHumidity: z.number().min(0).max(100),
});

export const POST = withRole('FARMER', async (req, user, context) => {
  try {
    const body = await req.json();
    const validation = batchCreate.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const data = { ...validation.data, farmerId: user.id, status: BatchStatus.PLANTED };

    const batch = await prisma.batch.create({ data });

    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
});
