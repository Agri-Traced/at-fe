import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRole } from '@/lib/auth';

export const GET = withRole('SHIPPER', async (req, user, context) => {
  try {
    const { id } = await context.params;

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { company: true }
    });

    if (userData?.company?.id !== id) {
      return NextResponse.json({ success: false, error: "Unauthorized, you can only get information for your own company" }, { status: 401 });
    }

    const batch = await prisma.batch.findMany({
      where: { shipperCompanyId: id },
      include: {
        farmer: { include: { company: true } },
      }
    });

    return NextResponse.json({ success: true, data: batch }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
})