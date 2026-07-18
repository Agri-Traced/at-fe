import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import z from 'zod'

const ProtectedKeySchema = z.object({
  id: z.string().min(1, "Missing Company ID"),
  key: z.string().min(6, "Protected Key must be at least 6 characters long")
});

export async function POST(
  req: Request,
) {
  try {
    const body = await req.json();
    const validation = ProtectedKeySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, errors: z.treeifyError(validation.error) }, { status: 400 });
    }

    const data = validation.data;

    const company = await prisma.company.findUnique({
      where: { id: data.id },
    });


    if (!company || company.protectedKey !== data.key) {
      return NextResponse.json({ success: false, error: "Invalid protected key" }, { status: 401 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}