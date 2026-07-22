import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BatchStatus } from '@/generated/prisma/enums';
import { Prisma } from '@/generated/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params phải là Promise
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const whereClause: Prisma.BatchWhereInput = {
      farmerId: id,
      plantTxHash: { not: null },
    };

    // Nếu query truyền lên hợp lệ (không rỗng), mới filter theo status
    if (query && query.trim() !== '') {
      whereClause.status = query as BatchStatus; // Nhớ import enum BatchStatus từ @prisma/client
    }

    const batch = await prisma.batch.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        farmer: {
          select: {
            fullName: true,
            company: { select: { companyName: true, location: true } }
          }
        },
        transits: {
          include: { shipper: true }
        },
        activity: {
          include: { steps: true },
        },
        qualityTest: {
          include: { retailer: true, steps: true },
        },
        shipperCompany: {
          select: { companyName: true, location: true }
        },
        retailCompany: {
          select: { companyName: true, location: true }
        }
      }
    });

    if (!batch) return NextResponse.json({ success: false, error: "Cannot find batch" }, { status: 404 });

    return NextResponse.json({ success: true, data: batch }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}