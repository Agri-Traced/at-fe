'use client';

import React from 'react';
import { Card, Tag, Avatar, Typography, Row, Col, Divider, Tooltip, Button } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  WalletOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  CopyOutlined,
  CalendarOutlined,
  KeyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/auth';

const { Title, Text } = Typography;

export default function DashboardPage() {
  // Cấu hình Màu sắc & Nhãn cho Role
  const roleConfig: Record<string, { color: string; label: string }> = {
    ADMIN: { color: 'red', label: 'Quản trị viên' },
    FARMER: { color: 'green', label: 'Nông dân / Nông trại' },
    SHIPPER: { color: 'volcano', label: 'Đơn vị vận chuyển' },
    RETAILER: { color: 'blue', label: 'Siêu thị / Nhà bán lẻ' },
    CONSUMER: { color: 'purple', label: 'Người tiêu dùng' },
  };

  const { user } = useAuth();
  if (!user) return null;

  // Rút gọn địa chỉ ví MetaMask
  const formatWallet = (address: string) => {
    if (!address) return 'Chưa kết nối';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Chào Mừng */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow rounded-2xl border-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              size={72}
              icon={<UserOutlined />}
              className="bg-white text-emerald-600 shadow-md font-bold text-2xl flex-shrink-0"
            >
              {user.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Title level={2} className="!text-white !mb-0 font-bold">
                  Xin chào, {user.fullName}!
                </Title>
                <Tag color={roleConfig[user.role]?.color || 'default'} className="font-semibold px-3 py-1 text-sm rounded-full">
                  {roleConfig[user.role]?.label || user.role}
                </Tag>
              </div>
              <Text className="text-emerald-100 mt-1 block">
                Chào mừng bạn quay trở lại với Hệ thống Truy xuất Nguồn gốc AgriTrace.
              </Text>
            </div>
          </div>

          {/* Wallet Badge */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 flex items-center gap-3">
            <WalletOutlined className="text-2xl text-yellow-300" />
            <div>
              <Text className="text-xs text-emerald-100 block uppercase tracking-wider font-semibold">
                Ví MetaMask
              </Text>
              <div className="flex items-center gap-2">
                <Text className="text-white font-mono font-medium">
                  {formatWallet(user.walletAddress)}
                </Text>
                <Tooltip title="Sao chép địa chỉ ví">
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined className="text-white" />}
                    onClick={() => copyToClipboard(user.walletAddress)}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5">
        <Row gutter={[24, 24]}>
          {/* Cột 1: Thông tin cá nhân */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <UserOutlined className="text-emerald-600" />
                  <span>Thông tin cá nhân</span>
                </div>
              }
              className="shadow-sm rounded-xl h-full border-gray-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <Text type="secondary" className="flex items-center gap-2">
                    <UserOutlined /> Họ và tên:
                  </Text>
                  <Text font-semibold className="font-medium text-gray-800">{user.fullName}</Text>
                </div>

                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <Text type="secondary" className="flex items-center gap-2">
                    <MailOutlined /> Email liên hệ:
                  </Text>
                  <Text className="font-medium text-gray-800">{user.email || 'Chưa cập nhật'}</Text>
                </div>

                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <Text type="secondary" className="flex items-center gap-2">
                    <PhoneOutlined /> Số điện thoại:
                  </Text>
                  <Text className="font-medium text-gray-800">{user.phone || 'Chưa cập nhật'}</Text>
                </div>

                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <Text type="secondary" className="flex items-center gap-2">
                    <SafetyCertificateOutlined /> Vai trò hệ thống:
                  </Text>
                  <Tag color={roleConfig[user.role]?.color}>{roleConfig[user.role]?.label}</Tag>
                </div>

                <div className="flex items-center justify-between">
                  <Text type="secondary" className="flex items-center gap-2">
                    <CalendarOutlined /> Ngày tham gia:
                  </Text>
                  <Text className="font-medium text-gray-800">
                    {dayjs(user.createdAt).format('DD/MM/YYYY')}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Cột 2: Thông tin Công ty / Tổ chức */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <BankOutlined className="text-blue-600" />
                  <span>Thông tin Doanh nghiệp / Tổ chức</span>
                </div>
              }
              className="shadow-sm rounded-xl h-full border-gray-200"
            >
              {user.company ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <Text type="secondary" className="flex items-center gap-2">
                      <BankOutlined /> Tên công ty:
                    </Text>
                    <Text className="font-bold text-blue-900 text-base">
                      {user.company.companyName}
                    </Text>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <Text type="secondary" className="flex items-center gap-2">
                      <SafetyCertificateOutlined /> Loại hình tổ chức:
                    </Text>
                    <Tag color="blue" className="font-semibold">
                      {user.company.type}
                    </Tag>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <Text type="secondary" className="flex items-center gap-2">
                      <EnvironmentOutlined /> Địa chỉ / Trụ sở:
                    </Text>
                    <Text className="font-medium text-gray-800 max-w-[250px] truncate text-right">
                      {user.company.location}
                    </Text>
                  </div>

                  <div className="flex items-center justify-between">
                    <Text type="secondary" className="flex items-center gap-2">
                      <UserOutlined /> Mã định danh Công ty (ID):
                    </Text>
                    <Text code className="text-xs">{user.company.id}</Text>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Tài khoản chưa được gán vào doanh nghiệp nào.
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};