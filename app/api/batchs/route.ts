import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const batchSchema = z.object({
  blockchainId: z.string().regex(/^\d+$/, "Blockchain ID must be a numeric string"),
  txHash: z.string().min(1, "Missing TxHash"),
  productName: z.string().min(1, "Missing Product Name"),
  category: z.enum(["VEGETABLE", "FRUIT", "GRAIN", "BEAN", "HERB", "OTHER"]),
  quantity: z.number().positive("Quantity must be a positive number"),
  unit: z.string().min(1, "Missing Unit"),
  ipfsHash: z.string().min(1, "Missing IPFS Hash"),
  qrCodeUrl: z.string().optional(),
  farmerId: z.uuid("Farmer ID must be a valid UUID"),
  expiryDate: z.iso.datetime().optional() // Định dạng ISO 8601
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = batchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: z.treeifyError(validation.error) }, { status: 400 });
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
      blockchainId: newBatch.blockchainId?.toString() ?? null
    };

    return NextResponse.json({ success: true, data: serializedBatch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}