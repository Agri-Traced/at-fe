import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Khung Validate bằng Zod
const userSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Wallet address is invalid"),
  fullName: z.string().min(2, "FullName is too short"),
  email: z.email("Email is invalid").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["FARMER", "SHIPPER", "RETAILER", "CONSUMER"]),
  companyId: z.string(),
  protectedKey: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }
    const company = await prisma.company.findUnique({
      where: { id: validation.data.companyId }
    });

    if (!company) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
    }

    if (company.protectedKey !== validation.data.protectedKey) {
      return NextResponse.json({ success: false, error: "Invalid protected key" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { walletAddress: validation.data.walletAddress }
    });

    if (userExists) {
      return NextResponse.json({ success: false, error: "User with this wallet address already exists" }, { status: 400 });
    }

    const data = validation.data;
    // Cập nhật hoặc tạo mới User
    const user = await prisma.user.create({
      data: {
        walletAddress: data.walletAddress,
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role,
        companyId: data.companyId
      },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An error occurred' }, { status: 500 });
  }
}