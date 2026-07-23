import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { BatchStatus, Role } from '@/generated/prisma/enums';
import { withRole } from '@/lib/auth';

const stepSchema = z.object({
  id: z.string().optional(), // 👈 Có id nghĩa là step cũ, không có id nghĩa là step mới
  stepOrder: z.number().int(),
  title: z.string().min(1, "Vui lòng nhập tên bước"),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  keyword: z.string().nullish(),
  values: z.string().nullish(),
  note: z.string().nullish(),
  dayOffset: z.number().int().default(0),
  isRequired: z.boolean().default(true),
  doAt: z.coerce.date().nullish(),
});

const updateStepsSchema = z.array(stepSchema);

export const PUT = withRole(Role.FARMER, async (req, user, context) => {
  try {
    const { id } = await context.params; // batchId
    const body = await req.json();
    const rawSteps = Array.isArray(body) ? body : (body.steps || body.data);

    const validation = updateStepsSchema.safeParse(rawSteps);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.format() }, { status: 400 });
    }

    const stepsData = validation.data;

    // 1. Kiểm tra Lô hàng
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: { activity: true }
    });

    if (!batch || batch.farmerId !== user.id) {
      return NextResponse.json({ success: false, error: "Không có quyền hoặc không tìm thấy lô hàng" }, { status: 403 });
    }

    // 2. Lấy hoặc Tạo Activity
    let activityId = batch.activity?.id;
    if (!activityId) {
      const newActivity = await prisma.activity.create({ data: { batchId: id } });
      activityId = newActivity.id;
    }

    // 3. Tiến hành CẬP NHẬT DẦN (Upsert & Delete orphan steps)

    // Lấy danh sách ID truyền lên từ Client
    const incomingStepIds = stepsData.map(s => s.id).filter(Boolean) as string[];

    await prisma.$transaction([
      // A. Xóa các step có trong DB nhưng KHÔNG có trong danh sách truyền lên (User đã nhấn xóa trên UI)
      prisma.activityStep.deleteMany({
        where: {
          activityId: activityId,
          id: { notIn: incomingStepIds }
        }
      }),

      // B. Upsert từng step: Cập nhật nếu đã có ID, Tạo mới nếu chưa có ID
      ...stepsData.map((step) => {
        if (step.id) {
          // UPDATE
          return prisma.activityStep.update({
            where: { id: step.id },
            data: {
              stepOrder: step.stepOrder,
              title: step.title,
              description: step.description ?? null,
              imageUrl: step.imageUrl ?? null,
              keyword: step.keyword ?? null,
              values: step.values ?? null,
              note: step.note ?? null,
              dayOffset: step.dayOffset,
              isRequired: step.isRequired,
              doAt: step.doAt ?? null,
            }
          });
        } else {
          return prisma.activityStep.create({
            data: {
              activityId: activityId!,
              stepOrder: step.stepOrder,
              title: step.title,
              description: step.description ?? null,
              imageUrl: step.imageUrl ?? null,
              keyword: step.keyword ?? null,
              values: step.values ?? null,
              note: step.note ?? null,
              dayOffset: step.dayOffset,
              isRequired: step.isRequired,
              doAt: step.doAt ?? null,
            }
          });
        }
      })
    ]);

    // 4. Lấy lại kết quả mới nhất
    const resultSteps = await prisma.activityStep.findMany({
      where: { activityId },
      orderBy: { stepOrder: 'asc' }
    });

    return NextResponse.json({ success: true, data: resultSteps }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi'
    }, { status: 500 });
  }
});