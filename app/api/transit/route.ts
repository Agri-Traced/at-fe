import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const transitSchema = z.object({
  batchId: z.uuid("Batch ID not valid"),
  shipperId: z.uuid("Shipper ID not valid"),
  txHash: z.string().min(1, "Missing TxHash"),
  fromLocation: z.string().min(1, "Missing departure location"),
  toLocation: z.string().min(1, "Missing destination location"),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  vehicleNumber: z.string().optional(),
  statusDetails: z.string().min(1, "Missing status description")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = transitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error}, { status: 400 });
    }

    const data = validation.data;

    // Sử dụng Transaction: Vừa lưu log vận chuyển, vừa update trạng thái lô hàng
    const [transitLog, updatedBatch] = await prisma.$transaction([
      prisma.stepTransit.create({ data }),
      prisma.batch.update({
        where: { id: data.batchId },
        data: { status: "IN_TRANSIT" }
      })
    ]);

    return NextResponse.json({ success: true, data: transitLog }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}