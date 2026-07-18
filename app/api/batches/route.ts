import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRole } from '@/lib/auth';
import { BatchStatus } from '@/generated/prisma/client';

const batchCreate = z.object({
  blockchainId: z.string().min(1, "Missing Blockchain ID"),
  productName: z.string().min(1, "Missing Product Name"),
  category: z.enum(["VEGETABLE", "FRUIT", "GRAIN", "BEAN", "HERB", "OTHER"]),
  quantity: z.number().positive("Quantity must be a positive number"),
  unit: z.string().min(1, "Missing Unit"),
  harvestDate: z.coerce.date().optional(), // Định dạng ISO 8601
  expiryDate: z.coerce.date().optional(), // Định dạng ISO 8601
  txHash: z.string().min(1, "Missing Transaction Hash"),
  ipfsHash: z.string().min(1, "Missing IPFS Hash"),
  retailCompanyId: z.string().min(1, "Missing Retail Company ID"),
});

export const POST = withRole('FARMER', async (req, user, context) => {
  try {
    const body = await req.json();
    const validation = batchCreate.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: z.treeifyError(validation.error) }, { status: 400 });
    }

    const data = { ...validation.data, farmerId: user.id, status: BatchStatus.PLANTED };

    const batch = await prisma.batch.create({ data });

    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
});
