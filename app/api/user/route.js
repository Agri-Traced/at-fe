import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Khung Validate bằng Zod
const userSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Ví không hợp lệ"),
  fullName: z.string().min(2, "Tên quá ngắn"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["FARMER", "SHIPPER", "RETAILER", "CONSUMER"]),
  // Dữ liệu Farm (chỉ bắt buộc nếu role là FARMER)
  farmName: z.string().optional(),
  location: z.string().optional(),
  certificate: z.string().optional()
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;
    const isFarmer = data.role === "FARMER";

    // Cập nhật hoặc tạo mới User (Upsert)
    const user = await prisma.user.upsert({
      where: { walletAddress: data.walletAddress },
      update: {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role,
        ...(isFarmer && data.farmName ? {
          farmInfo: {
            upsert: {
              create: { farmName: data.farmName, location: data.location, certificate: data.certificate },
              update: { farmName: data.farmName, location: data.location, certificate: data.certificate }
            }
          }
        } : {})
      },
      create: {
        walletAddress: data.walletAddress,
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role,
        ...(isFarmer && data.farmName ? {
          farmInfo: {
            create: { farmName: data.farmName, location: data.location, certificate: data.certificate }
          }
        } : {})
      },
      include: { farmInfo: true } // Trả về kèm thông tin Farm
    });

    return Response.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}