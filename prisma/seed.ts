import { OrganizationType } from "../generated/prisma/client"; // Thay đường dẫn import tương ứng với dự án của bạn

import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Đang khởi tạo dữ liệu Mẫu quy trình (Process Templates)...");

  // Giả định bạn đã có 3 Company đại diện cho 3 loại OrganizationType trong DB
  // Bạn có thể lấy ID thực tế từ DB của bạn
  const farmerCompany = await prisma.company.findFirst({
    where: { type: OrganizationType.FARMER },
  });
  const shipperCompany = await prisma.company.findFirst({
    where: { type: OrganizationType.SHIPPER },
  });
  const retailerCompany = await prisma.company.findFirst({
    where: { type: OrganizationType.RETAILER },
  });

  if (!farmerCompany || !shipperCompany || !retailerCompany) {
    console.error("❌ Vui lòng đảm bảo đã có ít nhất 1 Company cho mỗi loại FARMER, SHIPPER, RETAILER trong DB!");
    return;
  }

  // ==========================================
  // 1. QUY TRÌNH CHO FARMER (TRỒNG TÁO VIETGAP)
  // ==========================================
  const farmerTemplate = await prisma.processTemplate.create({
    data: {
      companyId: farmerCompany.id,
      name: "Quy trình Trồng & Chăm sóc Táo chuẩn VietGAP",
      description: "Quy trình chuẩn hóa từ khâu làm đất, bón phân đến thu hoạch đóng gói cho các loại Táo.",
      type: OrganizationType.FARMER,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Chuẩn bị đất & Gieo trồng",
            description: "Xử lý độ pH của đất, làm luống và tiến hành xuống giống cây con.",
            dayOffset: 0, // Ngày đầu tiên
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Bón phân đợt 1 (Phân hữu cơ & Vi sinh)",
            description: "Cung cấp dinh dưỡng phát triển bộ rễ sau 15 ngày gieo trồng.",
            dayOffset: 15,
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Kiểm tra sâu bệnh & Phun thuốc sinh học",
            description: "Thực hiện kiểm tra lá/thân và phun bù trừ thuốc BVTV sinh học theo tiêu chuẩn VietGAP.",
            dayOffset: 45,
            isRequired: false,
          },
          {
            stepOrder: 4,
            title: "Bọc trái & Kiểm tra dư lượng thuốc",
            description: "Tiến hành bọc quả chống côn trùng và lấy mẫu xét nghiệm chỉ số an toàn.",
            dayOffset: 75,
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Thu hoạch & Đóng gói Lô hàng",
            description: "Hái thủ công, phân loại kích thước, dán mã QR/BatchID và đóng vào thùng carton.",
            dayOffset: 90,
            isRequired: true,
          },
        ],
      },
    },
  });

  // ==========================================
  // 2. QUY TRÌNH CHO SHIPPER (VẬN CHUYỂN CHUỖI LẠNH ISO)
  // ==========================================
  const shipperTemplate = await prisma.processTemplate.create({
    data: {
      companyId: shipperCompany.id,
      name: "Quy trình Vận chuyển Chuỗi Lạnh ISO (Cold Chain)",
      description: "Quy trình kiểm soát nhiệt độ, độ ẩm liên tục trong suốt đường đi từ Trang trại tới Siêu thị.",
      type: OrganizationType.SHIPPER,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Tiếp nhận Lô hàng & Bật điều hòa thùng xe",
            description: "Kiểm tra tem niêm phong Lô hàng, làm mát thùng xe tải lạnh xuống 4°C - 8°C trước khi chất hàng.",
            dayOffset: 0,
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Kiểm tra định kỳ Chặng 1 (Khoảng cách 50km)",
            description: "Ghi nhận nhiệt độ, độ ẩm trên thiết bị IoT và cập nhật vị trí GPS.",
            dayOffset: 1,
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Bàn giao Lô hàng cho Siêu thị / Nhà bán lẻ",
            description: "Mở thùng xe, cho đại diện siêu thị đo nhiệt độ thực tế và ký biên bản giao nhận.",
            dayOffset: 2,
            isRequired: true,
          },
        ],
      },
    },
  });

  // ==========================================
  // 3. QUY TRÌNH CHO RETAILER (KIỂM ĐỊNH & BÀY BÁN)
  // ==========================================
  const retailerTemplate = await prisma.processTemplate.create({
    data: {
      companyId: retailerCompany.id,
      name: "Quy trình Nhập kho, Kiểm định & Kệ hàng Siêu thị",
      description: "Quy trình kiểm tra chất lượng đầu vào và phân phối sản phẩm tới tay người tiêu dùng.",
      type: OrganizationType.RETAILER,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Kiểm tra cảm quan & Đo chất lượng mẫu",
            description: "Đo độ ngọt (Brix), kiểm tra độ tươi, vết dập nát và đối chiếu mã Hash/TxHash trên Blockchain.",
            dayOffset: 0,
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Xác nhận QualityTest & Lưu kho mát",
            description: "Cập nhật kết quả Đạt/Không Đạt lên hệ thống và chuyển hàng vào kho bảo quản mát.",
            dayOffset: 0,
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Trưng bày lên Kệ hàng & Kích hoạt QR Code",
            description: "Bày bán sản phẩm tại khu vực trái cây tươi, dán tem QR để người tiêu dùng quét truy xuất.",
            dayOffset: 1,
            isRequired: true,
          },
        ],
      },
    },
  });

  console.log("✅ Đã tạo thành công 3 Mẫu quy trình!");
  console.log(`- Farmer Template ID: ${farmerTemplate.id}`);
  console.log(`- Shipper Template ID: ${shipperTemplate.id}`);
  console.log(`- Retailer Template ID: ${retailerTemplate.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });