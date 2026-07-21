import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params phải là Promise
) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id: id },
      include: {
        farmer: {
          include: {
            company: {
              select: { companyName: true, location: true }
            }
          }
        },
        activities: {
          orderBy: { timestamp: 'asc' }
        },
        transits: {
          include: { shipper: true },
          orderBy: { departureTime: 'asc' }
        },
        shipperCompany: {
          select: { companyName: true, location: true }
        },
        retailCompany: {
          select: { companyName: true, location: true }
        },
        qualityTest: {
          include: { retailer: true },
        }
      }
    });

    if (!batch) return NextResponse.json({ success: false, error: "Cannot find batch" }, { status: 404 });

    return NextResponse.json({ success: true, data: batch }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}

