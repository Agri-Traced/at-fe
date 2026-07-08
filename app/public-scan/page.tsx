'use client';

import React from 'react';
import { Card, Button, Typography, Row, Col, Space } from 'antd';
import {
  CheckCircleFilled,
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  KeyOutlined,
  DashboardOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cho từng bước trong chuỗi
interface StepData {
  step: number;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  date: string;
  hash: string;
  extraLabel: string;
  extraValue: string;
}

export default function ProvenanceTimeline() {
  // Bộ dữ liệu chuẩn hóa từ hình ảnh (Đã sửa lỗi chính tả AI)
  const steps: StepData[] = [
    {
      step: 1,
      title: 'FARM ORIGIN',
      icon: '🌱',
      color: '#2ea743',
      bgColor: '#f6ffed',
      borderColor: '#b7eb8f',
      date: '12/05/2024',
      hash: '0x7aF2Bc...91fA',
      extraLabel: 'Location',
      extraValue: 'Mekong Delta Organic Farm'
    },
    {
      step: 2,
      title: 'TRANSPORT',
      icon: '🚚',
      color: '#e0a200',
      bgColor: '#fffbe6',
      borderColor: '#ffe58f',
      date: '15/05/2024',
      hash: '0x1D3fG7...E72A',
      extraLabel: 'Status',
      extraValue: 'Shipped to Processing Plant'
    },
    {
      step: 3,
      title: 'PROCESSING',
      icon: '🏭',
      color: '#595959',
      bgColor: '#fafafa',
      borderColor: '#d9d9d9',
      date: '17/05/2024',
      hash: '0x8LMnPq...P09X',
      extraLabel: 'Status',
      extraValue: 'Milled & Packaged'
    },
    {
      step: 4,
      title: 'DISTRIBUTION',
      icon: '📦',
      color: '#d46b08',
      bgColor: '#fff7e6',
      borderColor: '#ffd591',
      date: '20/05/2024',
      hash: '0x2ZqW3e...R45T',
      extraLabel: 'Status',
      extraValue: 'Delivered to Retail'
    },
    {
      step: 5,
      title: 'CUSTOMER PURCHASE',
      icon: '🛒',
      color: '#cf1322',
      bgColor: '#fff1f0',
      borderColor: '#ffa39e',
      date: '22/05/2024',
      hash: '0x9VyX8b...S78U',
      extraLabel: 'Status',
      extraValue: 'Purchased by Customer'
    }
  ];

  const handleExplorerLink = () => {
    window.open('https://polygonscan.com', '_blank');
  };

  return (
    <div style={{
      maxWidth: 750,
      margin: '0 auto',
      padding: '24px 16px',
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* --- TOP BAR / HEADER --- */}
      <Card
        styles={{ body: { padding: '16px 20px' } }}
        style={{
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0',
          marginBottom: 32,
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Space size={12}>
            <CheckCircleFilled style={{ color: '#52c41a', fontSize: 28 }} />
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
                SCAN COMPLETE:
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Public Provenance Timeline</Text>
            </div>
          </Space>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleExplorerLink}
            style={{
              height: 46,
              borderRadius: 14,
              fontWeight: 600,
              backgroundColor: '#1677ff',
              boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)'
            }}
          >
            VIEW ON BLOCKCHAIN EXPLORER
          </Button>
        </div>
      </Card>

      {/* --- TIMELINE GRID LOGIC --- */}
      <div style={{ position: 'relative', padding: '0 8px' }}>

        {/* SVG ĐƯỜNG NỐI ZIGZAG (Ẩn trên màn hình siêu nhỏ, hiển thị tốt trên Desktop/Tablet) */}
        <div style={{
          position: 'absolute',
          top: 60, bottom: 60, left: 'calc(50% - 1px)',
          width: 2,
          backgroundColor: '#bae7ff',
          borderStyle: 'dashed',
          borderWidth: '0 0 0 2px',
          zIndex: 1,
          display: 'block'
        }} className="hidden-mobile" />

        <Row gutter={[16, 28]}>
          {steps.map((item) => {
            // Xác định vị trí lệch Trái / Phải hoặc kéo dài đối với phần tử cuối
            const isFullWidth = item.step === 5;
            const isLeft = item.step % 2 !== 0 && !isFullWidth;

            return (
              <Col
                key={item.step}
                xs={24}
                sm={isFullWidth ? 24 : 12}
                style={{
                  zIndex: 2,
                  order: item.step,
                  paddingLeft: isLeft ? 0 : undefined,
                  paddingRight: !isLeft && !isFullWidth ? 0 : undefined,
                }}
              >
                <Card
                  styles={{ body: { padding: '20px' } }}
                  style={{
                    backgroundColor: item.bgColor,
                    border: `2px solid ${item.borderColor}`,
                    borderRadius: 24,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.02)',
                    height: '100%',
                    transition: 'transform 0.2s',
                  }}
                  className="timeline-card"
                >
                  {/* Card Header: Step & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div>
                      <Title level={5} style={{ margin: 0, color: item.color, fontSize: 13, fontWeight: 700, letterSpacing: '0.5px' }}>
                        STEP {item.step}:
                      </Title>
                      <Title level={4} style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#262626' }}>
                        {item.title}
                      </Title>
                    </div>
                  </div>

                  {/* Card Content: Metadata Fields */}
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <CalendarOutlined style={{ color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: 13, width: 65, flexShrink: 0 }}>Date:</Text>
                      <Text strong style={{ color: '#434343', fontSize: 13 }}>{item.date}</Text>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <KeyOutlined style={{ color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: 13, width: 65, flexShrink: 0 }}>Hash:</Text>
                      <Text code style={{ fontSize: 12, backgroundColor: '#ffffff', border: '1px solid #e8e8e8' }}>
                        {item.hash}
                      </Text>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingTop: 4, borderTop: '1px dashed rgba(0,0,0,0.05)' }}>
                      {item.extraLabel === 'Location' ? (
                        <EnvironmentOutlined style={{ color: '#8c8c8c', marginTop: 3 }} />
                      ) : (
                        <DashboardOutlined style={{ color: '#8c8c8c', marginTop: 3 }} />
                      )}
                      <Text type="secondary" style={{ fontSize: 13, width: 65, flexShrink: 0 }}>{item.extraLabel}:</Text>
                      <Text style={{ color: '#1f1f1f', fontSize: 13, fontWeight: 500 }}>
                        {item.extraValue}
                      </Text>
                    </div>
                  </Space>

                  {/* Link nhanh tới block tương ứng (Tính năng cộng thêm công nghệ Web3) */}
                  <div style={{ textAlign: 'right', marginTop: 12, fontSize: 11 }}>
                    <Text type="secondary" style={{ cursor: 'pointer' }} onClick={handleExplorerLink}>
                      Verify on Chain <LinkOutlined style={{ fontSize: 10 }} />
                    </Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* CSS Nhúng phục vụ hiển thị Responsive di động ẩn đường kẻ dọc */}
      <style>{`
        @media (max-width: 575px) {
          .hidden-mobile {
            display: none !important;
          }
          .timeline-card {
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}