import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRole } from '@/lib/auth';
import { Role } from '@/app/generated/prisma/client';

const retailerSchema = z.object({
  retailCompanyId: z.string().min(1, "Missing Retail Company ID")
});

export const PATCH = withRole(Role.FARMER, async (req, user, context) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validation = retailerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error }, { status: 400 });
    }

    const { retailCompanyId } = validation.data;

    const updatedBatch = await prisma.$transaction(async (tx) => {
      // 1. Check Batch tồn tại
      const batch = await tx.batch.findUnique({ where: { id } });
      if (!batch) throw new Error("Không tìm thấy lô hàng tương ứng!");

      // 2. Check Company tồn tại
      const company = await tx.company.findUnique({ where: { id: retailCompanyId } });
      if (!company) throw new Error("Siêu thị/Nhà bán lẻ không tồn tại!");

      // 3. Cập nhật thông tin siêu thị nhận hàng
      return await tx.batch.update({
        where: { id },
        data: { retailCompanyId },
        include: { retailCompany: true }
      });
    });

    return NextResponse.json({ success: true, message: "Đã gán siêu thị nhận hàng!", data: updatedBatch });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
})