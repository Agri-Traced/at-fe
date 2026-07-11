import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const qualitySchema = z.object({
  batchId: z.uuid("Batch ID not valid"),
  inspectorId: z.uuid("Inspector ID not valid"),
  txHash: z.string().min(1, "Missing TxHash"),
  isPassed: z.boolean(),
  reportUrl: z.url("Invalid report URL").optional().or(z.literal("")),
  note: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = qualitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;

    const [qualityLog, updatedBatch] = await prisma.$transaction([
      prisma.stepQuality.create({ data }),
      ...(data.isPassed ? [prisma.batch.update({
        where: { id: data.batchId },
        data: { status: "RETAILING" }
      })] : [])
    ]);

    return NextResponse.json({ success: true, data: qualityLog }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}