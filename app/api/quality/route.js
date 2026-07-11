import { prisma } from "@/lib/prisma";
import { z } from "zod";

const qualitySchema = z.object({
  batchId: z.string().uuid("Batch ID không hợp lệ"),
  inspectorId: z.string().uuid("Inspector ID không hợp lệ"),
  txHash: z.string().min(1, "Thiếu TxHash"),
  isPassed: z.boolean(),
  reportUrl: z.string().url("Link báo cáo không hợp lệ").optional().or(z.literal("")),
  note: z.string().optional()
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = qualitySchema.safeParse(body);
    if (!validation.success) {
      return Response.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;

    const [qualityLog, updatedBatch] = await prisma.$transaction([
      prisma.stepQuality.create({ data }),
      prisma.batch.update({
        where: { id: data.batchId },
        // Chỉ cập nhật trạng thái nếu kiểm định ĐẠT
        ...(data.isPassed ? { data: { status: "RETAILING" } } : {})
      })
    ]);

    return Response.json({ success: true, data: qualityLog }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}