import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params phải là Promise
) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id: id },
      include: {
        farmer: { include: { company: true } },
        transits: {
          include: { shipper: true },
          orderBy: { departureTime: 'asc' } // Sắp xếp theo chặng từ cũ đến mới
        },
        qualityChecks: {
          include: { inspector: true },
          orderBy: { inspectedAt: 'desc' } // Lấy kiểm định mới nhất lên đầu
        }
      }
    });

    if (!batch) return NextResponse.json({ success: false, error: "Cannot find batch" }, { status: 404 });

    // Hàm đệ quy nhỏ để chuyển đổi mọi BigInt (nếu có) thành String
    const serializeData = JSON.parse(
      JSON.stringify(batch, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return NextResponse.json({ success: true, data: serializeData }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}

const batchUpdate = z.object({
  blockchainId: z.string().regex(/^\d+$/, "Blockchain ID must be a numeric string").optional(),
  txHash: z.string().optional(),
  productName: z.string().min(1, "Missing Product Name").optional(),
  category: z.enum(["VEGETABLE", "FRUIT", "GRAIN", "BEAN", "HERB", "OTHER"]).optional(),
  quantity: z.number().positive("Quantity must be a positive number").optional(),
  unit: z.string().min(1, "Missing Unit").optional(),
  ipfsHash: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  farmerId: z.uuid("Farmer ID must be a valid UUID").optional(),
  expiryDate: z.iso.datetime().optional() // Định dạng ISO 8601
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const validation = batchUpdate.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: z.treeifyError(validation.error) }, { status: 400 });
    }

    const data = { ...validation.data, blockchainId: validation.data.blockchainId ? BigInt(validation.data.blockchainId) : undefined };

    const newBatch = await prisma.batch.update({
      where: { id: id },
      data,
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