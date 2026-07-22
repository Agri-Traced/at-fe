"use client";

import React, { useState } from "react";
import { Timeline, Button, Tag, Card, Modal, Form, Input, DatePicker, InputNumber, App } from "antd";
import { PlusCircleOutlined, CheckCircleOutlined, CarOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { BatchStatusType, RoleType } from "@/generated/zod";

// Định nghĩa kiểu dữ liệu cho một Block trên Timeline
export interface TimelineBlock {
  id: string;
  type: "ACTIVITY" | "TRANSIT" | "QUALITY";
  title: string;
  description: string;
  timestamp: Date;
  txHash?: string | null;
  metadata?: {
    temperature?: number;
    humidity?: number;
    location?: string;
  };
}

interface BatchTraceabilityProps {
  batch: {
    id: string;
    status: BatchStatusType;
    productName: string;
  };
  currentUser: {
    id: string;
    role: RoleType;
  };
  initialBlocks: TimelineBlock[];
}

export default function Text() {
  const { notification } = App.useApp();
  const mockBatch = {
    id: "batch-uuid-1234-5678",
    blockchainId: "BATCH_001",
    productName: "Cà chua Cherry hữu cơ",
    productVariety: "Cherry đỏ Da Lat",
    status: 'IN_TRANSIT', // Đang trong quá trình vận chuyển
    farmerId: "farmer-user-01",
    minTemperature: 2.0,
    maxTemperature: 8.0,
    minHumidity: 70.0,
    maxHumidity: 90.0,
  };

  // 2. Dữ liệu User mẫu đang thao tác
  const mockCurrentUser = {
    id: "shipper-user-88",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    fullName: "Nguyễn Văn Giao (Express)",
    role: 'SHIPPER', // Thay đổi thành Role.FARMER hoặc RETAILER để test giao diện
  };

  // 3. Danh sách các Block dữ liệu trên Timeline
  const mockTimelineBlocks: TimelineBlock[] = [
    {
      id: "log-1",
      type: "ACTIVITY",
      title: "Gieo hạt & Bắt đầu vụ mùa",
      description: "Tiến hành gieo hạt giống Cà chua Cherry tại Luống A2 - Nông trại Chú Bảy.",
      timestamp: new Date("2026-06-01T08:00:00.000Z"),
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      id: "log-2",
      type: "ACTIVITY",
      title: "Bón phân vi sinh đợt 1",
      description: "Sử dụng phân bón hữu cơ đạt tiêu chuẩn VietGAP, bổ sung độ ẩm cho đất.",
      timestamp: new Date("2026-06-15T09:30:00.000Z"),
      txHash: "0x8888567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      id: "log-3",
      type: "ACTIVITY",
      title: "Thu hoạch & Đóng thùng",
      description: "Thu hoạch 500kg cà chua, phân loại đóng thùng xốp chuyên dụng.",
      timestamp: new Date("2026-07-20T06:00:00.000Z"),
      txHash: "0x9999567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      id: "transit-1",
      type: "TRANSIT",
      title: "Bàn giao lô hàng cho Shipper",
      description: "Xe lạnh biển số 49C-123.45 tiếp nhận lô hàng tại kho Lâm Đồng.",
      timestamp: new Date("2026-07-20T14:00:00.000Z"),
      txHash: "0x7777567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      metadata: {
        location: "Kho Lâm Đồng ➔ Trạm trung chuyển TP.HCM",
        temperature: 4.5,
        humidity: 82,
      },
    },
    {
      id: "transit-2",
      type: "TRANSIT",
      title: "Kiểm tra nhiệt độ định kỳ (Chặng 1)",
      description: "Kiểm tra hệ thống làm lạnh xe tải khi đi qua trạm dừng nghỉ Dầu Giây.",
      timestamp: new Date("2026-07-21T02:15:00.000Z"),
      txHash: "0x5555567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      metadata: {
        location: "Trạm Dầu Giây, Đồng Nai",
        temperature: 5.0,
        humidity: 80,
      },
    }
  ];
  const [blocks, setBlocks] = useState<TimelineBlock[]>(mockTimelineBlocks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const batch = mockBatch;
  const currentUser = mockCurrentUser;

  // State quản lý khi người dùng bấm thêm block
  const [targetTimestamp, setTargetTimestamp] = useState<dayjs.Dayjs>(dayjs());


  // Mở modal thêm block
  const handleOpenModal = (defaultTime?: Date) => {
    setTargetTimestamp(defaultTime ? dayjs(defaultTime) : dayjs());
    form.setFieldsValue({ timestamp: defaultTime ? dayjs(defaultTime) : dayjs() });
    setIsModalOpen(true);
  };

  // Xử lý khi Submit form thêm block mới
  const handleAddBlock = async (values: any) => {
    try {
      // TODO: Gọi API / Smart Contract ở đây để lưu vào Database & Blockchain
      // const res = await api.post('/api/batches/add-block', { ...values, batchId: batch.id });

      // Giả lập thêm block thành công vào state giao diện
      const newBlock: TimelineBlock = {
        id: Math.random().toString(),
        type: batch.status === "IN_TRANSIT" ? "TRANSIT" : batch.status === "RETAILING" ? "QUALITY" : "ACTIVITY",
        title: values.title || "Cập nhật tiến độ mới",
        description: values.description || "Ghi nhận thông tin vận hành",
        timestamp: values.timestamp ? values.timestamp.toDate() : new Date(),
        txHash: "0xabc123...mock_hash", // Giả lập txHash sau khi ký ví
        metadata: {
          temperature: values.temperature,
          humidity: values.humidity,
          location: values.toLocation,
        },
      };

      // Thêm vào danh sách và sắp xếp lại theo thời gian (đảm bảo tính timeline nối tiếp/chèn giữa)
      const updatedBlocks = [...blocks, newBlock].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setBlocks(updatedBlocks);
      setIsModalOpen(false);
      form.resetFields();

      notification.success({
        message: "Thêm block thành công!",
        description: "Dữ liệu đã được đồng bộ vào chuỗi cung ứng.",
        placement: "bottomRight",
      });
    } catch (error: any) {
      notification.error({
        message: "Lỗi thêm block",
        description: error?.message || "Không thể thực hiện giao dịch.",
        placement: "bottomRight",
      });
    }
  };

  return (
    <div style={{ padding: 32, background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>
          Hành trình Lô hàng: {batch.productName} <Tag color="blue">{batch.status}</Tag>
        </h2>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => handleOpenModal()}>
            Thêm Block mới
          </Button>
      </div>

      <Card style={{ borderRadius: 8 }}>
        <Timeline mode="left" style={{ marginTop: 20 }}>
          {blocks.map((block) => (
            <Timeline.Item
              key={block.id}
              color={block.txHash ? "green" : "blue"}
              dot={
                block.type === "TRANSIT" ? (
                  <CarOutlined style={{ fontSize: "16px" }} />
                ) : block.type === "QUALITY" ? (
                  <SearchOutlined style={{ fontSize: "16px" }} />
                ) : (
                  <CheckCircleOutlined style={{ fontSize: "16px" }} />
                )
              }
            >
              <Card size="small" style={{ width: 400, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{block.title}</strong>
                  <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    {dayjs(block.timestamp).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>
                <p style={{ margin: "8px 0 4px 0" }}>{block.description}</p>

                {/* Hiển thị Metadata nếu có (Nhiệt độ, Độ ẩm cho Shipper/Retailer) */}
                {block.metadata && (
                  <div style={{ fontSize: "12px", color: "#595959", marginBottom: 8 }}>
                    {block.metadata.temperature !== undefined && <span>🌡️ {block.metadata.temperature}°C | </span>}
                    {block.metadata.humidity !== undefined && <span>💧 {block.metadata.humidity}% | </span>}
                    {block.metadata.location && <span>📍 {block.metadata.location}</span>}
                  </div>
                )}

                {block.txHash && (
                  <div>
                    <Tag color="success" style={{ fontSize: "10px" }}>Mined on-chain ⛓</Tag>
                    <span style={{ fontSize: "11px", color: "#1890ff" }}>
                      {block.txHash.slice(0, 12)}...
                    </span>
                  </div>
                )}
              </Card>
            </Timeline.Item>
          ))}

          {/* Nút thêm block ở cuối timeline */}
            <Timeline.Item dot={<PlusCircleOutlined style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }} onClick={() => handleOpenModal()} />}>
              <span style={{ color: "#8c8c8c", fontStyle: "italic", cursor: "pointer" }} onClick={() => handleOpenModal()}>
                Tiếp tục ghi nhận block tiếp theo...
              </span>
            </Timeline.Item>
        </Timeline>
      </Card>

      {/* MODAL NHẬP THÔNG TIN BLOCK */}
      <Modal
        title="Thêm Block Thông Tin Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Xác nhận & Ký ví"
      >
        <Form form={form} layout="vertical" onFinish={handleAddBlock}>
          <Form.Item name="timestamp" label="Thời gian thực hiện sự kiện" rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="title" label="Tiêu đề hoạt động" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
            <Input placeholder="VD: Kiểm tra nhiệt độ kho lạnh / Bón phân đợt 2" />
          </Form.Item>

          <Form.Item name="description" label="Chi tiết nội dung">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết quá trình..." />
          </Form.Item>

          {/* Form động tùy thuộc vào Status / Role */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Form.Item name="temperature" label="Nhiệt độ (°C)">
                <InputNumber style={{ width: "100%" }} placeholder="4.5" />
              </Form.Item>
              <Form.Item name="humidity" label="Độ ẩm (%)">
                <InputNumber style={{ width: "100%" }} placeholder="85" />
              </Form.Item>
            </div>
        </Form>
      </Modal>
    </div>
  );
}