import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrganizationType } from '@/generated/prisma/enums';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const company = await prisma.company.findUnique({
      where: { id },
      select: { type: true }
    });

    if (!company) {
      return NextResponse.json({ success: false, error: "Không tìm thấy công ty yêu cầu" }, { status: 404 });
    }

    let whereCondition: any = {
      NOT: { plantTxHash: null }
    };

    if (company.type === OrganizationType.FARMER) {
      whereCondition.farmer = { companyId: id };
    }
    else if (company.type === OrganizationType.SHIPPER) {
      whereCondition.shipperCompanyId = id;
    }
    else if (company.type === OrganizationType.RETAILER) {
      whereCondition.retailerCompanyId = id;
    }

    const batches = await prisma.batch.findMany({
      where: whereCondition,
      include: {
        farmer: {
          select: {
            fullName: true,
            company: { select: { companyName: true, location: true } }
          }
        },
        qualityTest: {
          include: { retailer: true },
        },
        shipperCompany: {
          select: { companyName: true, location: true }
        },
        retailCompany: {
          select: { companyName: true, location: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: batches }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}