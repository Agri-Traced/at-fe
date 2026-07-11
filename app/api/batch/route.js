import { prisma } from "@/lib/prisma";
import { z } from "zod";

const batchSchema = z.object({
  blockchainId: z.string().regex(/^\d+$/, "Blockchain ID phải là số"),
  txHash: z.string().min(1, "Thiếu TxHash"),
  productName: z.string().min(1, "Thiếu tên sản phẩm"),
  category: z.string().min(1, "Thiếu danh mục"),
  quantity: z.number().positive("Số lượng phải lớn hơn 0"),
  unit: z.string().min(1, "Thiếu đơn vị"),
  ipfsHash: z.string().min(1, "Thiếu IPFS Hash"),
  qrCodeUrl: z.string().optional(),
  farmerId: z.string().uuid("Farmer ID không hợp lệ"),
  expiryDate: z.string().datetime().optional() // Định dạng ISO 8601
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = batchSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;

    const newBatch = await prisma.batch.create({
      data: {
        blockchainId: BigInt(data.blockchainId), // Ép kiểu BigInt
        txHash: data.txHash,
        productName: data.productName,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        ipfsHash: data.ipfsHash,
        qrCodeUrl: data.qrCodeUrl,
        farmerId: data.farmerId,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      }
    });

    // Serialize BigInt trước khi trả về
    const serializedBatch = {
      ...newBatch,
      blockchainId: newBatch.blockchainId.toString()
    };

    return Response.json({ success: true, data: serializedBatch }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}