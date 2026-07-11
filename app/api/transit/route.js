import { prisma } from "@/lib/prisma";
import { z } from "zod";

const transitSchema = z.object({
  batchId: z.string().uuid("Batch ID không hợp lệ"),
  shipperId: z.string().uuid("Shipper ID không hợp lệ"),
  txHash: z.string().min(1, "Thiếu TxHash"),
  fromLocation: z.string().min(1, "Thiếu điểm đi"),
  toLocation: z.string().min(1, "Thiếu điểm đến"),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  vehicleNumber: z.string().optional(),
  statusDetails: z.string().min(1, "Thiếu mô tả trạng thái")
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = transitSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({ success: false, errors: validation.error.format() }, { status: 400 });
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

    return Response.json({ success: true, data: transitLog }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}