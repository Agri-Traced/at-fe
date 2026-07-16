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

    const safeBatch = {
      ...batch,
      farmer: {
        ...batch.farmer,
        company: companyData // Chỉ chứa thông tin company đã lọc sạch
      }
    };

    return NextResponse.json({ success: true, data: safeBatch }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}

