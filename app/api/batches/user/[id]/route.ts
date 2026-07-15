import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params phải là Promise
) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findMany({
      where: { farmerId: id },
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