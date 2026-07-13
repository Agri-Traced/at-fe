import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Khung Validate bằng Zod
const userSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Ví không hợp lệ"),
  fullName: z.string().min(2, "Tên quá ngắn"),
  email: z.email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["FARMER", "SHIPPER", "RETAILER", "CONSUMER"]),
  companyId: z.string().optional(),
  certificate: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;
    // Cập nhật hoặc tạo mới User (Upsert)
    const user = await prisma.user.upsert({
      where: { walletAddress: data.walletAddress },
      update: {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role,
        companyId: data.companyId || null
      },
      create: {
        walletAddress: data.walletAddress,
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role,
      },
      include: { company: true } // Trả về kèm thông tin Farm
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}