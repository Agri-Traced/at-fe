import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params phải là Promise
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id: id },
    });

    if (!company) return NextResponse.json({ success: false, error: "Cannot find company" }, { status: 404 });

    const { protectedKey, ...companyData } = company;

    return NextResponse.json({ success: true, data: companyData }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}