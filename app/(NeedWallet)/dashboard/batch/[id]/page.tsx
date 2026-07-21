"use client";

import { useBatch } from "@/hooks/batchs";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AssignForm } from "../../components/AssignForm";
import { TransitForm } from "../../components/TransitForm";
import { QualityTestForm } from "../../components/QualityTestForm";
import { useState } from "react";
import { Button } from "antd";
import { Loading } from "@/app/components/Loading";
import { useAuth } from "@/contexts/auth";

export default function BatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openTransitModal, setOpenTransitModal] = useState(false);
  const [openQualityTestModal, setOpenQualityTestModal] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const { t } = useTranslation();
  const { data: batch, isLoading } = useBatch(id);
  const { user } = useAuth();

  if (!user) {
    throw new Error("User not found");
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!batch) {
    return (
      <div className="max-w-xl mx-auto my-8 p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">
        <p className="font-semibold">
          {t("batch.notFound", "Không tìm thấy thông tin lô hàng")}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm font-medium transition"
        >
          {t("common.back", "Quay lại")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header & Nút Quay lại */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("batch.detailTitle", "Lô hàng")} #{id}
            </h1>
          </div>

          {/* Badge trạng thái */}
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {batch.status || t("batch.status.unknown", "Chưa xác định")}
          </span>
        </div>

        {/* Thẻ tóm tắt thông tin lô hàng (Giúp giao diện không bị trống) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              {t("batch.id", "Mã lô")}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {batch.id || id}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              {t("batch.createdAt", "Ngày tạo")}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {batch.createdAt
                ? new Date(batch.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {/* Bạn có thể hiển thị thêm thông tin ngắn nếu muốn */}
          {batch.shipperCompany && (
            <div className="col-span-2">
              <span className="text-xs text-gray-400 uppercase font-semibold block">
                {t("batch.shipCompany", "Đơn vị vận chuyển")}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {batch.shipperCompany?.companyName}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {batch.shipperCompany?.location}
              </span>
            </div>
          )}

          {batch.retailCompany && (
            <div className="col-span-2">
              <span className="text-xs text-gray-400 uppercase font-semibold block">
                {t("batch.retailCompany", "Đơn vị bán lẻ")}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {batch.retailCompany?.companyName}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {batch.retailCompany?.location}
              </span>
            </div>
          )}
        </div>

        {/* Cụm nút bấm thao tác tối giản */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            hidden={user.role !== "RETAILER"}
            type="primary"
            onClick={() => setOpenAssignModal(true)}
          >
            {t("batch.assign", "Confirm & Assign")}
          </Button>
          <Button
            hidden={user.role !== "SHIPPER"}
            type="primary"
            onClick={() => {
              setLocation(batch.farmer.company.location);
              setOpenTransitModal(true);
            }}
          >
            {t("batch.transit", "Transit batch")}
          </Button>
          <Button
            hidden={user.role !== "RETAILER"}
            disabled={batch.status !== "IN_TRANSIT"}
            type="primary"
            onClick={() => setOpenQualityTestModal(true)}
          >
            {t("batch.qualityTest", "Quality Test")}
          </Button>
        </div>
      </div>
      <AssignForm
        open={openAssignModal}
        onClose={() => {
          setOpenAssignModal(false);
        }}
        id={id}
      />
      <TransitForm
        open={openTransitModal}
        onClose={() => {
          setOpenTransitModal(false);
        }}
        id={id}
        location={location}
      />
      <QualityTestForm
        open={openQualityTestModal}
        onClose={() => {
          setOpenQualityTestModal(false);
        }}
        id={id}
      />
    </>
  );
}
