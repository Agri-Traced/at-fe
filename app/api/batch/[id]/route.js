import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const batch = await prisma.batch.findUnique({
      where: { id: id },
      include: {
        farmer: { include: { farmInfo: true } },
        transits: {
          include: { shipper: true },
          orderBy: { departureTime: 'asc' } // Sắp xếp theo chặng từ cũ đến mới
        },
        qualityChecks: {
          include: { inspector: true },
          orderBy: { inspectedAt: 'desc' } // Lấy kiểm định mới nhất lên đầu
        }
      }
    });

    if (!batch) return Response.json({ success: false, error: "Không tìm thấy lô hàng" }, { status: 404 });

    // Hàm đệ quy nhỏ để chuyển đổi mọi BigInt (nếu có) thành String
    const serializeData = JSON.parse(
      JSON.stringify(batch, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return Response.json({ success: true, data: serializeData }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}