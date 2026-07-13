import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import z from 'zod'

const ProtectedKeySchema = z.object({
  protectedKey: z.string().min(6, "Protected Key must be at least 6 characters long")
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string, companyId: string }> } // params phải là Promise
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validation = ProtectedKeySchema.safeParse(body);
    const company = await prisma.company.findUnique({
      where: { id: id },
    });

    if (!validation.success) {
      return NextResponse.json({ success: false, errors: z.treeifyError(validation.error) }, { status: 400 });
    }

    if (!company || company.protectedKey !== validation.data.protectedKey) {
      return NextResponse.json({ success: false, error: "Invalid protected key" }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}