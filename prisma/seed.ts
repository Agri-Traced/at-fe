import { Category, OrganizationType } from "../generated/prisma/client"; // Thay đường dẫn import tương ứng với dự án của bạn

import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Đang khởi tạo dữ liệu Mẫu quy trình (Process Templates)...");

  const companies = [
    {
      id: "FARM",
      type: OrganizationType.FARMER,
      companyName: "Nông trại Xanh Đà Lạt",
      location: "Lạc Dương, Lâm Đồng",
      protectedKey: "FARM123",
    },
    {
      id: "SHIP",
      type: OrganizationType.SHIPPER,
      companyName: "ColdChain Logistics",
      location: "Quận 7, TP.HCM",
      protectedKey: "SHIP123",
    },
    {
      id: "RETAIL",
      type: OrganizationType.RETAILER,
      companyName: "Siêu thị FreshMart",
      location: "Quận 1, TP.HCM",
      protectedKey: "RETAIL123",
    },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: {}, // Nếu đã tồn tại id này rồi thì không cập nhật gì cả (tương đương DO NOTHING)
      create: company,
    });
  }
  // ==========================================
  // 1. QUY TRÌNH CHO FARMER (TRỒNG TÁO VIETGAP)
  // ==========================================

  const fruitTemplate = await prisma.processTemplate.create({
    data: {
      name: "Quy trình Trồng & Thu hoạch Trái cây chuẩn VietGAP",
      description: "Quy trình áp dụng chung cho các loại cây ăn trái (Táo, Cam, Bưởi, Xoài...).",
      type: OrganizationType.FARMER,
      category: Category.FRUIT,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Chuẩn bị đất & Tiến hành xuống giống",
            description: "Xử lý độ pH của đất, bón lót phân hữu cơ và trồng cây con.",
            dayOffset: 0,
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Bón phân định kỳ & Chăm sóc bộ rễ",
            description: "Bón bổ sung phân vi sinh và tưới nước giữ ẩm sau 15 ngày.",
            keyword: "Liều lượng phân bón",
            dayOffset: 15,
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Tỉa cành & Kiểm soát sâu bệnh",
            description: "Tỉa bớt cành sâu bệnh và phun thuốc bảo vệ thực vật sinh học.",
            dayOffset: 45,
            keyword: "liều lượng thuốc",
            isRequired: false,
          },
          {
            stepOrder: 4,
            title: "Bọc trái & Test chỉ số an toàn",
            description: "Bọc quả chống côn trùng và lấy mẫu đo dư lượng hóa chất.",
            keyword: "Chỉ số dư lượng thuốc",
            dayOffset: 75,
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Thu hoạch & Đóng gói Lô hàng",
            description: "phân loại, dán mã QR/BatchID",
            dayOffset: 90,
          },
        ],
      },
    },
  });

  // 2. DÀNH CHO VEGETABLE (Rau củ)
  const vegetableTemplate = await prisma.processTemplate.create({
    data: {
      name: "Quy trình Trồng & Thu hoạch Rau củ ngắn ngày",
      description: "Áp dụng cho các loại rau ăn lá, rau ăn củ (Cải, Cà rốt, Cà chua, Khoai tây...).",
      type: OrganizationType.FARMER,
      category: Category.VEGETABLE,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Làm đất, ủ phân & Gieo hạt/Cấy cây",
            description: "Cày bừa đất mịn, lên luống cao thoát nước và tiến hành gieo hạt.",
            dayOffset: 0,
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Tưới nước & Bón thúc đợt 1",
            description: "Tưới tự động duy trì độ ẩm 70%, bón thúc bằng phân hữu cơ hoai mục.",
            dayOffset: 10,
            keyword: "Liều lượng phân bón",
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Phòng trừ sâu bệnh bằng vi sinh",
            description: "Kiểm tra mặt dưới lá, sử dụng chế phẩm nấm 3 màu hoặc bẫy vàng.",
            dayOffset: 25,
            keyword: "Liều lượng thuốc vi sinh",
            isRequired: false,
          },
          {
            stepOrder: 4,
            title: "Cách ly trước thu hoạch (PHI)",
            description: "Ngừng hoàn toàn việc phun thuốc/bón phân để đảm bảo thời gian cách ly an toàn.",
            dayOffset: 35,
            keyword: "Thời gian cách ly",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Thu hoạch & Đóng gói Lô hàng",
            description: "phân loại, dán mã QR/BatchID",
            dayOffset: 40,
          },
        ],
      },
    },
  });

  // 3. DÀNH CHO GRAIN (Lúa ngũ cốc)
  const grainTemplate = await prisma.processTemplate.create({
    data: {
      name: "Quy trình Trồng & Chế biến Lúa / Ngũ cốc",
      description: "Áp dụng cho Lúa gạo, Bắp (Ngô), Lúa mạch, Nếp...",
      type: OrganizationType.FARMER,
      category: Category.GRAIN,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Làm đất ruộng/nương & Gieo sạ",
            description: "Làm đất phẳng, ngâm ủ hạt giống nảy mầm và tiến hành gieo sạ.",
            dayOffset: 0,
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Dẫn nước & Bón phân đẻ nhánh",
            description: "Điều tiết mực nước vào ruộng và bón phân thúc cây đẻ nhánh khỏe.",
            dayOffset: 20,
            keyword: "Liều lượng phân bón",
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Quản lý sâu bệnh giai đoạn làm đòng",
            description: "Theo dõi rầy nâu, đạo ôn và phun phòng trừ đúng kỹ thuật.",
            dayOffset: 50,
            keyword: "Liều lượng thuốc",
            isRequired: true,
          },
          {
            stepOrder: 4,
            title: "Rút nước & Thu hoạch cơ giới",
            description: "Tháo khô nước ruộng trước 10 ngày, dùng máy gặt đập liên hợp thu hoạch.",
            dayOffset: 95,
            keyword: "Thời gian thu hoạch",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Sấy khô & Bóc vỏ/Đóng bao",
            description: "Sấy nông sản đạt độ ẩm tiêu chuẩn (<14%), tuốt hạt và đóng bao bì bảo quản.",
            dayOffset: 100,
          },
        ],
      },
    },
  });

  // 4. DÀNH CHO BEAN (Đậu / Hạt)
  const beanTemplate = await prisma.processTemplate.create({
    data: {
      name: "Quy trình Canh tác & Thu hoạch Các loại Hạt Đậu",
      description: "Áp dụng cho Đậu nành, Đậu xanh, Đậu đen, Lạc (Đậu phụng)...",
      type: OrganizationType.FARMER,
      category: Category.BEAN,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Xử lý hạt giống & Trồng theo hàng",
            description: "Thử độ nảy mầm của hạt, gieo theo hàng/hốc với khoảng cách tiêu chuẩn.",
            dayOffset: 0,
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Vun gốc & Bón phân lót/thúc",
            description: "Xới xáo đất, làm sạch cỏ dại và vun gốc cho cây đứng vững.",
            dayOffset: 15,
            keyword: "Liều lượng phân bón",
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Kiểm tra sâu cuốn lá & Sâu đẻ quả",
            description: "Kiểm tra thân và hoa, sử dụng bẫy pheromone hoặc thuốc sinh học.",
            dayOffset: 35,
            keyword: "Liều lượng thuốc",
            isRequired: false,
          },
          {
            stepOrder: 4,
            title: "Thu hái quả già & Phơi khô",
            description: "Thu hoạch khi vỏ quả chuyển sang màu vàng/nâu, tiến hành phơi nắng nhẹ.",
            dayOffset: 70,
            keyword: "Thời gian thu hoạch",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Tách hạt, Sàng lọc & Đóng gói",
            description: "Đập/tách lấy hạt, sàng lọc bỏ hạt lép/mốc và đóng bao hút chân không.",
            dayOffset: 75,
          },
        ],
      },
    },
  });

  // 5. DÀNH CHO HERB (Thảo mộc / Gia vị)
  const herbTemplate = await prisma.processTemplate.create({
    data: {
      name: "Quy trình Trồng & Sơ chế Thảo mộc & Gia vị",
      description: "Áp dụng cho Húng quế, Bạc hà, Tiêu, Ớt, Gừng, Sả...",
      type: OrganizationType.FARMER,
      category: Category.HERB,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Chuẩn bị giá thể / Đất trồng chất lượng cao",
            description: "Trộn giá thể xơ dừa, trấu hun và phân hữu cơ vi sinh.",
            dayOffset: 0,
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Tưới phun sương & Bổ sung khoáng chất",
            description: "Sử dụng hệ thống tưới phun sương tự động, kiểm tra độ ẩm định kỳ.",
            dayOffset: 7,
            keyword: "Liều lượng phân bón",
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Bắt sâu thủ công & Cắt tỉa ngọn",
            description: "Cắt ngọn kích thích phân nhánh, tuyệt đối không dùng hóa chất độc hại.",
            dayOffset: 20,
            keyword: "Liều lượng thuốc",
            isRequired: true,
          },
          {
            stepOrder: 4,
            title: "Thu hái chọn lọc",
            description: "Thu hoạch lá/thân đạt tiêu chuẩn độ tuổi, tránh làm dập nát tinh dầu.",
            dayOffset: 30,
            keyword: "Thời gian thu hoạch",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Rửa siêu âm / Sấy lạnh / Đóng gói",
            description: "Rửa sạch bụi bẩn bằng nước ozone, sấy lạnh giữ màu/hương vị và đóng gói.",
            dayOffset: 32,
            keyword: "Độ ẩm sau sấy",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Thu hoạch & Đóng gói Lô hàng",
            description: "phân loại, dán mã QR/BatchID",
            dayOffset: 90,
          },
        ],
      },
    },
  });

  // 6. DÀNH CHO OTHER (Sản phẩm nông nghiệp khác)
  const otherTemplate = await prisma.processTemplate.create({
    data: {
      name: "Quy trình Sản xuất & Canh tác Nông sản Chung",
      description: "Mẫu quy trình cơ bản 3 bước dành cho các loại nông sản khác chưa phân loại.",
      type: OrganizationType.FARMER,
      category: Category.OTHER,
      steps: {
        create: [
          {
            stepOrder: 1,
            title: "Chuẩn bị nguyên liệu & Xuống giống",
            description: "Kiểm tra điều kiện đầu vào, chuẩn bị mặt bằng và tiến hành sản xuất.",
            dayOffset: 0,
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Chăm sóc & Theo dõi tiến độ",
            description: "Thực hiện các hoạt động tưới tiêu, bón phân và ghi chép nhật ký canh tác.",
            dayOffset: 15,
            keyword: "Liều lượng phân bón",
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Thu hoạch, Kiểm định & Đóng gói",
            description: "Nghiệm thu chất lượng sản phẩm, dán tem QR và đóng gói xuất bán.",
            dayOffset: 30,
            keyword: "Thời gian thu hoạch",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Thu hoạch & Đóng gói Lô hàng",
            description: "phân loại, dán mã QR/BatchID",
            dayOffset: 90,
          },
        ],
      },
    },
  });

  const farmerTemplate = await prisma.processTemplate.create({
    data: {
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
            keyword: "Số lượng gieo trồng",
            isRequired: true,
          },
          {
            stepOrder: 2,
            title: "Bón phân đợt 1 (Phân hữu cơ & Vi sinh)",
            description: "Cung cấp dinh dưỡng phát triển bộ rễ sau 15 ngày gieo trồng.",
            dayOffset: 15,
            keyword: "Liều lượng phân bón",
            isRequired: true,
          },
          {
            stepOrder: 3,
            title: "Kiểm tra sâu bệnh & Phun thuốc sinh học",
            description: "Thực hiện kiểm tra lá/thân và phun bù trừ thuốc BVTV sinh học theo tiêu chuẩn VietGAP.",
            dayOffset: 45,
            keyword: "Liều lượng thuốc",
            isRequired: false,
          },
          {
            stepOrder: 4,
            title: "Bọc trái & Kiểm tra dư lượng thuốc",
            description: "Tiến hành bọc quả chống côn trùng và lấy mẫu xét nghiệm chỉ số an toàn.",
            dayOffset: 75,
            keyword: "Dư lượng thuốc",
            isRequired: true,
          },
          {
            stepOrder: 5,
            title: "Thu hoạch & Đóng gói Lô hàng",
            description: "Hái thủ công, phân loại kích thước, dán mã QR/BatchID và đóng vào thùng carton.",
            dayOffset: 90,
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

  console.log("✅ Đã tạo thành công Mẫu quy trình!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });