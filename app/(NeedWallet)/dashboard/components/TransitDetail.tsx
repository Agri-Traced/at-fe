import React from "react";
import { Card, Tag, Typography, Button, Empty, Space } from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  TruckOutlined,
  ShopOutlined,
  UserOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { BatchRelation } from "@/hooks/batchs";

type Props = {
  batch: BatchRelation;
  onReturn?: () => void;
};

export const TransitDetail = ({ batch, onReturn }: Props) => {
  const { t } = useTranslation();

  // Sắp xếp các chặng vận chuyển theo thời gian khởi hành
  const transits = [...(batch?.transits || [])].sort(
    (a, b) =>
      new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={onReturn} icon={<ArrowLeftOutlined />} shape="circle" />
        <div>
          <Typography.Title level={4} className="!mb-0">
            {t("Supply Chain Journey")}
          </Typography.Title>
          <Typography.Text type="secondary" className="text-xs">
            {t("Batch Category")}: {batch.category}
          </Typography.Text>
        </div>
      </div>

      <div className="relative pl-6 md:pl-8 border-l-2 border-dashed border-blue-300 ml-4 space-y-8">
        {/* 1. ĐIỂM ĐẦU: TRANG TRẠI */}
        <div className="relative">
          <div className="absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md z-10">
            <EnvironmentOutlined className="text-base" />
          </div>

          <Card
            className="shadow-sm border-emerald-200 bg-emerald-50/30"
            styles={{ body: { padding: "16px 20px" } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Tag color="green" className="mb-1 font-semibold">
                  {batch.farmer.company.companyName}
                </Tag>
                <h4 className="font-bold text-lg text-neutral-800 m-0">
                  {batch.farmer.company.location}
                </h4>
              </div>
              <CheckCircleFilled className="text-emerald-500 text-xl" />
            </div>
          </Card>
        </div>
        {transits.length === 0 ? (
          <Card className="text-center !mb-8">
            <Empty description={t("No transit steps recorded yet.")} />
          </Card>
        ) : (
          transits.map((transit, index) => (
            <div key={transit.id} className="relative">
              <div className="absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10">
                <TruckOutlined className="text-base" />
              </div>

              <Card
                className="shadow-sm border-blue-100 hover:shadow-md transition-shadow"
                styles={{ body: { padding: "18px 20px" } }}
              >
                {/* Header Chặng */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 text-sm">
                      #{index + 1}
                    </span>
                    <h4 className="font-semibold text-base text-neutral-800 m-0">
                      {transit.fromLocation} ➔ {transit.toLocation}
                    </h4>
                  </div>
                  <Tag icon={<ClockCircleOutlined />} color="blue" className="m-0">
                    {new Date(transit.departureTime).toLocaleString("vi-VN")}
                  </Tag>
                </div>

                {/* Chi tiết vận chuyển */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-700">
                  {/* Người vận chuyển & Biển số */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-blue-500" />
                      <span className="text-neutral-500">{t("Shipper")}:</span>
                      <strong className="text-neutral-800">
                        {transit.shipper?.fullName || t("Unknown")}
                      </strong>
                      {transit.shipper?.phone && (
                        <span className="text-xs text-neutral-400">
                          ({transit.shipper.phone})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <TruckOutlined className="text-blue-500" />
                      <span className="text-neutral-500">{t("Vehicle")}:</span>
                      <Tag color="cyan" className="font-mono m-0">
                        {transit.vehicleNumber}
                      </Tag>
                    </div>
                  </div>

                  {/* Thông số môi trường */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DashboardOutlined className="text-amber-500" />
                      <span className="text-neutral-500">{t("Temperature")}:</span>
                      <strong className="text-neutral-800">
                        {transit.temperature}°C
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <DashboardOutlined className="text-cyan-500" />
                      <span className="text-neutral-500">{t("Humidity")}:</span>
                      <strong className="text-neutral-800">
                        {transit.humidity}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Mã giao dịch Blockchain nếu có */}
                {transit.txHash && (
                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center gap-2 text-xs">
                    <LinkOutlined className="text-purple-600" />
                    <span className="text-neutral-500">TxHash:</span>
                    <Typography.Text
                      copyable
                      code
                      className="text-purple-700 max-w-[240px] md:max-w-md truncate"
                    >
                      {transit.txHash}
                    </Typography.Text>
                  </div>
                )}
              </Card>
            </div>
          ))
        )}

        {/* 3. ĐIỂM CUỐI: NHÀ BÁN LẺ */}
        <div className="relative">
          <div className="absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md z-10">
            <ShopOutlined className="text-base" />
          </div>

          <Card
            className="shadow-sm border-indigo-200 bg-indigo-50/30"
            styles={{ body: { padding: "16px 20px" } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Tag color="purple" className="mb-1 font-semibold">
                  {batch?.retailCompany?.companyName}
                </Tag>
                <h4 className="font-bold text-lg text-neutral-800 m-0">
                  {batch?.retailCompany?.location}
                </h4>
              </div>
              <ShopOutlined className="text-indigo-500 text-2xl" />
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};