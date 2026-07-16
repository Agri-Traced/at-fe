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
        // 1. Đúng: Lấy farmer và thông tin công ty của farmer đó
        farmer: {
          include: { company: true }
        },

        // 2. Sửa lại: transits (trước đó bạn viết sai thành trasits)
        transits: {
          include: { shipper: true },
          orderBy: { departureTime: 'asc' }
        },

        // 3. Sửa lại: qualityTest (trước đó bạn viết sai thành qualityTests)
        // Và kiểm tra trường 'retailer' thay vì 'inspector' nếu đó là tên trong model của bạn
        qualityTest: {
          include: { retailer: true },
          // Lưu ý: QualityTest là 1-1 nên không có orderBy ở đây được 
          // (trừ khi bạn đổi nó thành 1-nhiều)
        }
      }
    });

    if (!batch) return NextResponse.json({ success: false, error: "Cannot find batch" }, { status: 404 });

    const { protectedKey, ...companyData } = batch.farmer.company;

    return NextResponse.json({ success: true, data: batch }, { status: 200 });
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

    const data = validation.data;

    const newBatch = await prisma.batch.update({
      where: { id: id },
      data,
    });

    return NextResponse.json({ success: true, data: newBatch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}