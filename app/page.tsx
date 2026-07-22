"use client";

import React, { useState } from 'react';
import { Row, Col, Button, Card, Space, Drawer } from 'antd';
import {
  MenuOutlined,
  SafetyCertificateOutlined,
  DeploymentUnitOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import Link from 'next/link';

export default function LandingPage() {
  const [visible, setVisible] = useState(false);

  // Menu links chung cho cả desktop và mobile drawer
  const navLinks = (
    <Space direction={visible ? "vertical" : "horizontal"} size="large" className={visible ? "w-full" : ""}>
      <Link href="#features" className="text-gray-600 hover:text-green-600 font-medium">Tính năng</Link>
    </Space>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white text-gray-800">

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-green-700 flex items-center gap-2">
            <img src="/icon.png" alt="AgriTrace Logo" className="h-8 w-8" />
            AgriTrace
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks}
            <Link href="/dashboard" className="hidden md:inline-block">
              <Button type="primary" size="middle" className="bg-green-600 hover:bg-green-700 border-none rounded-md">
                Vào Hệ Thống
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden border-none shadow-none"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer title="Menu" placement="right" onClose={() => setVisible(false)} open={visible}>
        <div className="flex flex-col gap-6">
          {navLinks}
          <Link href="/dashboard" className="hidden md:inline-block">
            <Button type="primary" block className="bg-green-600 border-none mt-4">
              Vào Hệ Thống
            </Button>
          </Link>
        </div>
      </Drawer>

      {/* ─── HERO SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-28">
        <Row gutter={[32, 48]} align="middle">
          <Col xs={24} md={12} className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Minh bạch nông sản với <span className="text-green-600">Blockchain & IPFS</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Giải pháp tối ưu hóa chuỗi cung ứng, số hóa nhật ký canh tác của nông dân và xây dựng niềm tin tuyệt đối với người tiêu dùng qua từng mã QR định danh.
            </p>
            <Space size="middle" className="w-full sm:w-auto">
              <Link href="/dashboard">
                <Button type="primary" size="large" className="bg-green-600 hover:bg-green-700 border-none h-12 px-8 rounded-lg text-base">
                  Bắt đầu ngay
                </Button>
              </Link>
            </Space>
          </Col>

          {/* Hero Image / Graphic Slot */}
          <Col xs={24} md={12} className="flex justify-center">
            <div className="w-full max-w-md md:max-w-full aspect-square bg-[url('/login-background.png')] bg-cover rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border border-green-200">
              {/* Đặt ảnh hoặc hình minh họa blockchain/farm tại đây */}
            </div>
          </Col>
        </Row>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="bg-gray-50/50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">Tính năng cốt lõi</h2>
            <p className="text-gray-600">Nền tảng công nghệ toàn diện phục vụ cho mọi tác vụ trong chuỗi giá trị nông nghiệp.</p>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="h-full border-none shadow-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center text-xl mb-4">
                  <SafetyCertificateOutlined />
                </div>
                <h3 className="text-lg font-bold mb-2">Chống giả mạo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Mọi dữ liệu về lô hàng được ký số trực tiếp lên Smart Contract, đảm bảo không một ai có thể thay đổi lịch sử sau khi đã ghi nhận.
                </p>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="h-full border-none shadow-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-xl mb-4">
                  <DeploymentUnitOutlined />
                </div>
                <h3 className="text-lg font-bold mb-2">Lưu trữ phi tập trung</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Hình ảnh, chứng nhận chất lượng và file metadata lớn được lưu trữ trên mạng lưới IPFS, tối ưu chi phí on-chain mà vẫn an toàn.
                </p>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="h-full border-none shadow-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center text-xl mb-4">
                  <BarChartOutlined />
                </div>
                <h3 className="text-lg font-bold mb-2">Vận hành tinh gọn</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Phân quyền thông minh cho Farmer, Shipper, Retailer giúp luồng cập nhật trạng thái lô hàng diễn ra chỉ với một thao tác quét QR.
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

    </div>
  );
}