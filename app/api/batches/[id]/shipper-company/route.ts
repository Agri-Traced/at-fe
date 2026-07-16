import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRole } from '@/lib/auth';
import { Role } from '@/generated/prisma/enums';

const shipperSchema = z.object({
  shipperCompanyId: z.string().min(1, "Missing Shipper Company ID")
});

interface RouteParams {
  params: { id: string };
}

export const PATCH = withRole(Role.RETAILER, async (req, user, context) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validation = shipperSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const { shipperCompanyId } = validation.data;

    const updatedBatch = await prisma.$transaction(async (tx) => {
      // 1. Check Batch tồn tại
      const batch = await tx.batch.findUnique({ where: { id } });
      if (!batch) throw new Error("Không tìm thấy lô hàng tương ứng!");

      // 2. Check Company tồn tại
      const company = await tx.company.findUnique({ where: { id: shipperCompanyId } });
      if (!company) throw new Error("Công ty vận chuyển không tồn tại!");

      // 3. Cập nhật và chuyển trạng thái sang IN_TRANSIT (nếu cần thiết)
      return await tx.batch.update({
        where: { id },
        data: {
          shipperCompanyId,
          status: "IN_TRANSIT" // Tự động đổi trạng thái khi đã bàn giao cho bên vận chuyển
        },
        include: { shipperCompany: true }
      });
    });

    return NextResponse.json({ success: true, message: "Đã gán đơn vị vận chuyển!", data: updatedBatch });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
})