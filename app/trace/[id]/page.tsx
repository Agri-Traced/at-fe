'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  LoadingOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons';
import { Badge, Steps, Card, Progress } from 'antd';
import { Loading } from '@/app/components/Loading';
import { useTranslation } from 'react-i18next';
import { BatchRelation, useBatch } from '@/hooks/batchs';



// Mock Data lấy từ cả Database (Web2) và Blockchain (Web3)
const mockTraceData = {
  id: "b4a3c102-1a2b-3c4d-5e6f-7g8h9i0j",
  blockchainId: "125",
  txHash: "0x8fa3f8...7b2c9a",
  productName: "Bắp Cải Thảo Hữu Cơ VietGAP",
  category: "VEGETABLE",
  quantity: 500,
  unit: "KG",
  ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  status: "RETAILING", // Đang bán lẻ (Đã qua kiểm định thành công)
  qrCodeUrl: "/qr-mock.png",
  farmer: {
    name: "Hợp Tác Xã Nông Nghiệp Sạch Vĩnh Long",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B"
  },
  harvestDate: "2026-07-10",
  expiryDate: "2026-07-25",
  createdAt: "2026-05-01",

  // Lịch sử canh tác (Off-chain ActivityLog)
  activities: [
    { id: "1", description: "Gieo hạt giống cải thảo F1 Nhật Bản", timestamp: "2026-05-01" },
    { id: "2", description: "Bón phân hữu cơ vi sinh đợt 1", timestamp: "2026-05-20" },
    { id: "3", description: "Kiểm tra sâu bệnh & làm cỏ thủ công", timestamp: "2026-06-15" },
    { id: "4", description: "Thu hoạch cải thảo và đóng gói theo chuẩn VietGAP", timestamp: "2026-07-10" }
  ],

  // Thông tin chuỗi cung ứng lạnh (On-chain & Off-chain)
  transits: [
    {
      id: "t1",
      shipper: "Logistics Xanh - Tài xế Nguyễn Văn A (Ví: 0x921...33a)",
      fromLocation: "Hợp Tác Xã Vĩnh Long",
      toLocation: "Kho phân phối Aeon Mall Bình Tân",
      temperature: 5.5, // Nhiệt độ lạnh tiêu chuẩn
      humidity: 85,
      vehicleNumber: "51C-999.99",
      departureTime: "2026-07-11 04:00",
      arrivalTime: "2026-07-11 08:30",
      txHash: "0x3bc76a...991ab"
    },
    {
      id: "t1",
      shipper: "Logistics Xanh - Tài xế Nguyễn Văn A (Ví: 0x921...33a)",
      fromLocation: "Hợp Tác Xã Vĩnh Long",
      toLocation: "Kho phân phối Aeon Mall Bình Tân",
      temperature: 5.5, // Nhiệt độ lạnh tiêu chuẩn
      humidity: 85,
      vehicleNumber: "51C-999.99",
      departureTime: "2026-07-11 04:00",
      arrivalTime: "2026-07-11 08:30",
      txHash: "0x3bc76a...991ab"
    }
  ],

  // Kết quả kiểm định chất lượng (On-chain QualityTest)
  qualityTest: {
    retailer: "Bộ Phận Kiểm Định Aeon Mall (Ví: 0x33b...44f)",
    timestamp: "2026-07-11 10:00",
    isPassed: true,
    note: "Sản phẩm tươi ngon, không phát hiện dư lượng thuốc bảo vệ thực vật. Đạt chuẩn VietGAP.",
    txHash: "0xd901bc...112ee"
  }
};

export default function TracePage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useTranslation();

  if (!id) return <div className="p-8 text-center">Không tìm thấy thông tin lô hàng!</div>;

  const { data, isLoading: loading } = useBatch(id);

  const transportSummary = useMemo(() => {
    if (!data || !data.transits || data.transits.length === 0) return null;
    // Tính nhiệt độ trung bình
    const avgTemp = data.transits.reduce((acc, curr) => acc + (curr.temperature ?? 0), 0) / data.transits.length;
    // Tìm nhiệt độ cao nhất
    const maxTemp = Math.max(...data.transits.map(t => t.temperature ?? 0));
    // Kiểm tra xem tất cả các chặng có "đạt ngưỡng an toàn" không
    const isAllSafe = data.transits.every(t => (t.temperature ?? 0) >= 2 && (t.temperature ?? 0) <= 8);
    return { avgTemp, maxTemp, isAllSafe };
  }, [data?.transits]);

  if (loading) {
    return (
      <Loading message={t('Fetching trace data...')} />
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy thông tin lô hàng với ID: {id}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white pb-12">
      {/* HEADER: Thương hiệu & Chứng thực Blockchain */}
      <div className="bg-green-600 text-white p-6 rounded-b-[2.5rem] shadow-lg text-center relative">
        <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
          <SafetyCertificateOutlined /> Sepolia Testnet
        </div>
        <h1 className="text-2xl font-bold tracking-wide mt-4">AGRI-TRACE</h1>
        <p className="text-green-100 text-xs mt-1">Hệ Thống Minh Bạch Chuỗi Cung Ứng Nông Sản</p>

        {/* Huy hiệu Verified cực kỳ uy tín */}
        <div className="mt-6 inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-full shadow-md font-semibold text-sm">
          <CheckCircleOutlined className="text-green-500 text-lg animate-pulse" />
          Nguồn Gốc Đã Được Xác Thực
        </div>
      </div>

      {/* THÔNG TIN SẢN PHẨM CHÍNH */}
      <div className="px-4 -mt-4">
        <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-gray-400">ID Lô hàng: #{data.blockchainId || "Chưa đồng bộ"}</span>
            <Badge count="VietGAP" style={{ backgroundColor: '#1dad55' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{data.productName}</h2>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Tổng sản lượng</p>
              <p className="font-semibold text-gray-700">{data.quantity} {data.unit}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Nông dân sản xuất</p>
              <p className="font-semibold text-gray-700 truncate">{data.farmer.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs"><CalendarOutlined /> Ngày thu hoạch</p>
              <p className="font-medium text-gray-700">{data.harvestDate ? new Date(data.harvestDate).toLocaleDateString() : "Chưa xác định"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs"><CalendarOutlined /> Hạn sử dụng</p>
              <p className="font-medium text-red-500">{data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : "Chưa xác định"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* THÔNG SỐ CHUỖI CUNG ỨNG LẠNH (COLD CHAIN STATUS) */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DashboardOutlined className="text-green-600" />
          Giám Sát Chuỗi Cung Ứng Lạnh
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-xs text-gray-400">Nhiệt độ trung bình</p>
            <p className="text-2xl font-bold text-blue-600">
              {transportSummary ? `${transportSummary.avgTemp.toFixed(1)}°C` : "--"}
            </p>
          </Card>
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-xs text-gray-400">Trạng thái toàn chặng</p>
            <p className={`text-sm font-bold ${transportSummary?.isAllSafe ? 'text-green-600' : 'text-red-600'}`}>
              {transportSummary?.isAllSafe ? "An toàn" : "Có sai lệch"}
            </p>
          </Card>
        </div>
      </div>

      {/* TIMELINE HÀNH TRÌNH KHÉP KÍN (SƠ ĐỒ TRỰC QUAN) */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DeploymentUnitOutlined className="text-green-600" />
          Hành Trình Chi Tiết
        </h3>
        <Card className="shadow-sm border-0 rounded-2xl">
          <Steps
            direction="vertical"
            current={3}
            size="small"
            items={[
              {
                title: <span className="font-bold text-sm text-gray-800">1. Gieo Trồng & Canh Tác</span>,
                description: data.activities ? (
                  <div className="text-xs text-gray-500 mt-1">
                    <p className="font-semibold text-green-600">{data.farmer.fullName}</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {data.activities.map(act => (
                        <li key={act.id}>{act.description}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">⚠ CHƯA CÓ DỮ LIỆU HOẠT ĐỘNG</p>
                  </div>
                ),
              },
              {
                title: <span className="font-bold text-sm text-gray-800">2. Thu Hoạch & Đóng Gói</span>,
                description: (
                  <div className="text-xs text-gray-500 mt-1">
                    <p>Ngày: <span className="font-medium text-gray-700">{data.harvestDate ? new Date(data.harvestDate).toLocaleDateString() : "Chưa xác định"}</span></p>
                    <p className="text-blue-600 underline break-all font-mono">IPFS Hash: {data.ipfsHash}</p>
                  </div>
                ),
              },
              {
                title: <span className="font-bold text-sm text-gray-800">3. Vận Chuyển Chuỗi Lạnh</span>,
                description: data.transits ? data.transits.map((transit) => (
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    <p>Vận chuyển bởi: <span className="font-medium text-gray-700">{transit.shipper.fullName}</span></p>
                    <p>Phương tiện: <span className="font-medium text-gray-700">{transit.vehicleNumber}</span></p>
                    <p><EnvironmentOutlined /> Điểm đi: {transit.fromLocation}</p>
                    <p><EnvironmentOutlined /> Điểm đến: {transit.toLocation}</p>
                    <p className="text-gray-400 font-mono text-[10px]">Blockchain Tx: {transit.txHash}</p>
                  </div>
                )) : (
                  <div className="text-xs text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">⚠ CHƯA CÓ DỮ LIỆU VẬN CHUYỂN</p>
                  </div>
                ),
              },
              {
                title: <span className="font-bold text-sm text-gray-800">4. Kiểm Định & Bán Lẻ</span>,
                description: data.qualityTest ? (
                  <div className="text-xs text-gray-500 mt-1 p-2.5 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-700">✓ KẾT QUẢ: ĐẠT TIÊU CHUẨN</p>
                    <p className="mt-1">Người duyệt: {data.qualityTest.retailer.fullName}</p>
                    <p className="italic text-gray-600">"{data.qualityTest.note}"</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-1">Blockchain Tx: {data.qualityTest.txHash}</p>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">⚠ KẾT QUẢ: CHƯA ĐƯỢC KIỂM DỊNH</p>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {/* BLOCKCHAIN METADATA FOOTER */}
      <div className="px-4 mt-6 text-center">
        <p className="text-gray-400 text-[10px]">Mã giao dịch khởi tạo (TxHash):</p>
        <p className="text-blue-500 text-[10px] font-mono break-all hover:underline cursor-pointer">
          {data.txHash}
        </p>
        <p className="text-gray-300 text-[9px] mt-4">Agri-Trace v2.5 • Bảo mật bởi hợp đồng thông minh ERC-20/721</p>
      </div>
    </div>
  );
}