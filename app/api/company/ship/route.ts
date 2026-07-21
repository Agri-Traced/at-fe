import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrganizationType } from '@/generated/prisma/enums';

export async function GET(
  req: Request,
) {
  try {
    const companies = await prisma.company.findMany({
      where: { type: OrganizationType.SHIPPER },
    });

    return NextResponse.json({ success: true, data: companies }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}

