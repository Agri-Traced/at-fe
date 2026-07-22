"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Badge, Steps, Card, Typography, Tooltip, Image, Button } from "antd";
import { Loading } from "@/app/components/Loading";
import { useTranslation } from "react-i18next";
import { useBatch } from "@/hooks/batchs";
import Link from "next/link";

export default function TracePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useTranslation();

  if (!id) return <div className="p-8 text-center">{t("Batch not found")}</div>;

  const { data, isLoading: loading } = useBatch(id);

  const transportSummary = useMemo(() => {
    if (!data || !data.transits || data.transits.length === 0) return null;
    const avgTemp =
      data.transits.reduce((acc, curr) => acc + (curr.temperature ?? 0), 0) /
      data.transits.length;
    const avgHumidity =
      data.transits.reduce((acc, curr) => acc + (curr.humidity ?? 0), 0) /
      data.transits.length;
    const isAllSafe = data.transits.every(
      (t) =>
        (t.temperature ?? 0) >= data.maxTemperature &&
        (t.temperature ?? 0) <= data.minTemperature &&
        (t.humidity ?? 0) >= data.minHumidity &&
        (t.humidity ?? 0) <= data.maxHumidity,
    );
    return { avgTemp, avgHumidity, isAllSafe };
  }, [data?.transits]);

  if (loading) {
    return <Loading message={t("Fetching trace data...")} />;
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">{t("Batch not found")}</div>
    );
  }

  const current =
    data.status === "PLANTED"
      ? 1
      : data.status === "HARVESTED"
        ? 2
        : data.status === "IN_TRANSIT"
          ? 3
          : data.status === "RETAILING"
            ? 4
            : 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white pb-12">
      {/* HEADER: Thương hiệu & Chứng thực Blockchain */}
      <div
        className={`bg-green-600 text-white p-6 rounded-b-[2.5rem] shadow-lg text-center relative`}
      >
        <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1 backdrop-blur-sm">
          <SafetyCertificateOutlined /> Sepolia Testnet
        </div>
        <h1 className="text-2xl font-bold tracking-wide mt-4">AGRI TRACE</h1>
        <p className="text-green-100 text-sm mt-1">
          {t("Transparent Agri Trace for Agricultural Products")}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-full shadow-md font-semibold text-base">
          {data.status !== 'RETAILING' ? (
            <>
              <Typography.Text>
                {t(
                  "This batch is still in progress, are you an agri chain attendance?",
                )}
              </Typography.Text>
              <Button
                onClick={() => {
                  router.push(`/dashboard/batch/${data.id}`);
                }}
                type="primary"
                shape="round"
                icon={<EditOutlined />}
              >
                {t("Action")}
              </Button>
            </>
          ) : (
            <>
              <CheckCircleOutlined className="text-green-500 text-lg animate-pulse" />
              {t("Origin Verified")}
            </>
          )}
        </div>
      </div>

      <div className="px-4 -mt-4">
        <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-400">
              {t("Batch ID")}: #{data.blockchainId || "Chưa đồng bộ"}
            </span>
            <Badge count="VietGAP" style={{ backgroundColor: "#1dad55" }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {data.productName}
          </h2>
          <Image
            src={data.imageUrl}
            alt={data.productName}
            width="100%"
            height="auto"
            style={{ objectFit: "contain" }}
            className="mt-3"
          />
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-base">
            <div>
              <p className="text-gray-400 text-sm">{t("Quantity")}</p>
              <p className="font-semibold text-gray-700">
                {data.quantity} {data.unit}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t("Farmer")}</p>
              <p className="font-semibold text-gray-700 truncate">
                {data.farmer.fullName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                <CalendarOutlined />
                {t("Harvest Date")}
              </p>
              <p className="font-medium text-gray-700">
                {data.harvestDate
                  ? new Date(data.harvestDate).toLocaleDateString()
                  : "Chưa xác định"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                <CalendarOutlined />
                {t("Expiry Date")}
              </p>
              <p className="font-medium text-red-500">
                {data.expiryDate
                  ? new Date(data.expiryDate).toLocaleDateString()
                  : "Chưa xác định"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DashboardOutlined className="text-green-600" />
          {t("Company involved")}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Card
            title={t("Farmer")}
            className="shadow-sm border-0 text-center rounded-xl"
          >
            <p className="text-base font-bold ">
              {data.farmer.company.companyName}
            </p>
            <p className="text-sm text-gray-400">
              {data.farmer.company.location}
            </p>
          </Card>
          <Card
            title={t("Shipper")}
            className="shadow-sm border-0 text-center rounded-xl"
          >
            <p className="text-base font-bold">
              {data?.shipperCompany?.companyName || "Chưa xác định"}
            </p>
            <p className="text-sm text-gray-400">
              {data?.shipperCompany?.location || "--"}
            </p>
          </Card>
          <Card
            title={t("Retailer")}
            className="shadow-sm border-0 text-center rounded-xl"
          >
            <p className="text-base font-bold">
              {data?.retailCompany?.companyName || "Chưa xác định"}
            </p>
            <p className="text-sm text-gray-400">
              {data?.retailCompany?.location || "--"}
            </p>
          </Card>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DashboardOutlined className="text-green-600" />
          {t("Cold Chain Status")}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-sm text-gray-400">{t("Average Temperature")}</p>
            <p className="text-xl font-bold text-blue-600">
              {`🌡️ ${transportSummary ? transportSummary.avgTemp.toFixed(1) + "°C" : "--"}`}
            </p>
          </Card>
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-sm text-gray-400">{t("Average Humidity")}</p>
            <p className="text-xl font-bold text-blue-600">
              {`💧 ${transportSummary ? transportSummary.avgHumidity.toFixed(1) + "%" : "--"}`}
            </p>
          </Card>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DeploymentUnitOutlined className="text-green-600" />
          {t("Agri Tracing Journey")}
        </h3>
        <Card className="shadow-sm border-0 rounded-2xl">
          <Steps
            orientation="vertical"
            current={current}
            items={[
              {
                title: (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-800">
                      1. {t("Seeding & Cultivation")}
                    </span>
                    <Tooltip title={data?.plantTxHash}>
                      <Typography.Text copyable>
                        <Link
                          href={`https://sepolia.etherscan.io/tx/${data?.plantTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data?.plantTxHash?.slice(0, 6)}...
                          {data?.plantTxHash?.slice(-4)}
                        </Link>
                      </Typography.Text>
                    </Tooltip>
                  </div>
                ),
                description: (
                  <div className="text-sm text-gray-500 mt-1">
                    <p className="font-semibold text-green-600">{`${data.farmer.fullName} - ${data.farmer.company.companyName}`}</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>{`${t("Address")}: ${data.farmer.company.location}`}</li>
                      <li>{`${t("Planting Date")}: ${new Date(data.createdAt).toLocaleDateString()}`}</li>
                      <li>{`${t("Seed Variety")}: ${data.productVariety}`}</li>
                    </ul>
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 text-base mb-3">
                        {t("Cultivation History")}:
                      </p>

                      {/* 🎯 SỬA LỖI LOGIC: Nếu KHÔNG CÓ activity hoặc mảng steps RỖNG thì mới báo "No Data" */}
                      {!data?.activity || !data.activity.steps || data.activity.steps.length === 0 ? (
                        <div className="text-sm text-gray-500 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
                          <span className="text-yellow-600 font-bold">⚠</span>
                          <p className="font-medium text-yellow-700">
                            {t("No Activity Data Available")}
                          </p>
                        </div>
                      ) : (
                        /* 🚀 GIAO DIỆN LIỆT KÊ MỚI: TIMELINE CARDS */
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                          {data.activity.steps
                            .sort((a, b) => a.stepOrder - b.stepOrder) // Sắp xếp theo thứ tự bước
                            .map((act) => (
                              <div key={act.id} className="relative group">
                                {/* Dot Timeline */}
                                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">
                                  {act.stepOrder}
                                </div>

                                {/* Nội dung Bước */}
                                <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      {/* Badge Từ khóa */}
                                      {act.keyword && (
                                        <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-md mb-1">
                                          {act.keyword}
                                        </span>
                                      )}
                                      {/* Tiêu đề Bước */}
                                      <h4 className="font-semibold text-gray-900 text-sm">
                                        {act.title}
                                      </h4>
                                    </div>

                                    {/* Thời gian thực hiện doAt */}
                                    {act.doAt && (
                                      <span className="text-[12px] text-gray-400 whitespace-nowrap">
                                        {new Date(act.doAt).toLocaleDateString("vi-VN", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </span>
                                    )}
                                  </div>

                                  {/* Mô tả chi tiết */}
                                  {act.description && (
                                    <p className="text-xs text-gray-600 mt-1">{act.description}</p>
                                  )}
                                  {/* Thông số Tiêu chuẩn & Thực tế */}
                                  {(act.values || act.note) && (
                                    <div className="mt-2.5 pt-2 border-t border-gray-50 flex flex-col gap-1 text-xs">
                                      {act.values && (
                                        <div className="text-gray-500">
                                          <span className="font-medium text-gray-700">Tiêu chuẩn:</span> {act.values}
                                        </div>
                                      )}
                                      {act.note && (
                                        <div className="text-emerald-700 bg-emerald-50/50 p-1.5 rounded-md">
                                          <span className="font-semibold">Ghi chú thực tế:</span> {act.note}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {/* Ảnh chụp minh họa (nếu có) */}
                                  {act.imageUrl && (
                                    <div className="mt-2.5">
                                      <img
                                        src={act.imageUrl}
                                        alt={act.title}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-100"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                title: (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-800">
                      2. {t("Harvest & Packaging")}
                    </span>
                    <Tooltip title={data?.retailTxHash}>
                      <Typography.Text copyable>
                        <Link
                          href={`https://sepolia.etherscan.io/tx/${data?.retailTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data?.retailTxHash?.slice(0, 6)}...
                          {data?.retailTxHash?.slice(-4)}
                        </Link>
                      </Typography.Text>
                    </Tooltip>
                  </div>
                ),
                description: data?.retailTxHash ? (
                  <div className="text-sm text-gray-500 mt-1">
                    <p>{`${t("Date")}: ${data.harvestDate ? new Date(data.harvestDate).toLocaleDateString() : "Chưa xác định"}`}</p>
                    <p>{`${t("Quantity")}: ${`${data.quantity ?? "Chưa xác định"} ${data.unit ?? ""}`}`}</p>
                    <p>{`${t("Expiry Date")}: ${data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : "Chưa xác định"}`}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">
                      ⚠ {t("No Activity Data Available")}
                    </p>
                  </div>
                ),
              },
              {
                title: (
                  <span className="font-bold text-base text-gray-800">
                    3. {t("Transportation")}
                  </span>
                ),
                description:
                  data.transits && data.transits.length > 0 ? (
                    data.transits.map((transit) => (
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Typography.Text className="font-semibold">{`${t("Shipped By")}: ${transit?.shipper?.fullName}`}</Typography.Text>
                          <Tooltip title={transit?.txHash}>
                            <Typography.Text copyable>
                              <Link
                                href={`https://sepolia.etherscan.io/tx/${transit?.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {transit?.txHash?.slice(0, 6)}...
                                {transit?.txHash?.slice(-4)}
                              </Link>
                            </Typography.Text>
                          </Tooltip>
                        </div>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>{`${t("Vehicle")}: ${transit?.vehicleNumber}`}</li>
                          <li>{`${t("From Location")}: ${transit?.fromLocation}`}</li>
                          <li>{`${t("To Location")}: ${transit?.toLocation}`}</li>
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="font-semibold text-yellow-700">
                        ⚠ {t("No Transportation Data Available")}
                      </p>
                    </div>
                  ),
              },
              {
                title: (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-800">
                      4. {t("Quality Testing & Retail")}
                    </span>
                    <Tooltip title={data?.qualityTest?.txHash}>
                      <Typography.Text copyable>
                        <Link
                          href={`https://sepolia.etherscan.io/tx/${data?.qualityTest?.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data?.qualityTest?.txHash?.slice(0, 6)}...
                          {data?.qualityTest?.txHash?.slice(-4)}
                        </Link>
                      </Typography.Text>
                    </Tooltip>
                  </div>
                ),
                description: !data?.qualityTest ? (
                  /* TH 1: Chưa kiểm định */
                  <div className="text-sm text-gray-500 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
                    <span className="text-yellow-600 font-bold">⚠</span>
                    <p className="font-medium text-yellow-700">
                      {t("Not Yet Tested")}
                    </p>
                  </div>
                ) : (
                  /* TH 2: Đã có kết quả kiểm định */
                  <div className="space-y-3">
                    {/* 1. CARD KẾT QUẢ TỔNG QUAN */}
                    <div
                      className={`p-4 rounded-xl border text-sm transition-all ${data.qualityTest.isPassed
                        ? "bg-emerald-50/60 border-emerald-200"
                        : "bg-red-50/60 border-red-200"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-sm ${data.qualityTest.isPassed ? "bg-emerald-600" : "bg-red-600"
                              }`}
                          >
                            {data.qualityTest.isPassed ? "✓" : "✕"}
                          </span>
                          <div>
                            <p
                              className={`font-bold text-base ${data.qualityTest.isPassed ? "text-emerald-800" : "text-red-800"
                                }`}
                            >
                              {data.qualityTest.isPassed
                                ? t("Meets Standards")
                                : t("Does Not Meet Standards")}
                            </p>
                            {data.qualityTest.createdAt && (
                              <p className="text-xs text-gray-500">
                                {t("Tested On")}:{" "}
                                {new Date(data.qualityTest.createdAt).toLocaleDateString("vi-VN")}
                              </p>

                            )}
                          </div>
                        </div>

                        {/* Badge Bất biến Blockchain */}
                        {data.qualityTest.txHash && (
                          <span className="px-2.5 py-1 bg-white/80 border border-emerald-300 text-emerald-800 rounded-full text-xs font-medium flex items-center gap-1 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            On-chain Verified
                          </span>
                        )}
                      </div>

                      {/* Người kiểm định */}
                      {data.qualityTest.retailer?.fullName && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200/50 flex items-center justify-between text-xs text-gray-600">
                          <span>
                            <span className="font-semibold">{t("Approved By")}:</span>{" "}
                            {data.qualityTest.retailer.fullName}
                          </span>
                          {data?.retailCompany?.companyName && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                              {data?.retailCompany?.companyName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 2. DANH SÁCH CHI TIẾT CÁC BƯỚC KIỂM ĐỊNH (CHECKLIST STEPS) */}
                    {data.qualityTest.steps && data.qualityTest.steps.length > 0 && (
                      <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm space-y-2.5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          {t("Inspection Details")} ({data.qualityTest.steps.length} {t("criteria")})
                        </p>

                        <div className="space-y-2">
                          {data.qualityTest.steps
                            .sort((a, b) => a.stepOrder - b.stepOrder)
                            .map((step) => (
                              <div
                                key={step.id}
                                className="p-3 bg-gray-50/80 hover:bg-gray-50 rounded-lg border border-gray-100 text-xs transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-400 min-w-[18px]">
                                      #{step.stepOrder}
                                    </span>
                                    <div>
                                      <h5 className="font-semibold text-gray-800 text-sm">
                                        {step.title}
                                      </h5>
                                      {step.description && (
                                        <p className="text-gray-500 mt-0.5">{step.description}</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Badge Từ khóa */}
                                  {step.keyword && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded text-[11px] whitespace-nowrap">
                                      {step.keyword}
                                    </span>
                                  )}
                                </div>

                                {/* Thông số Tiêu chuẩn & Ghi chú thực tế */}
                                {(step.values || step.note) && (
                                  <div className="mt-2 pt-2 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                                    {step.values && (
                                      <div className="bg-white p-1.5 rounded border border-gray-100">
                                        <span className="text-gray-400 font-medium">{t("Target Standard")}: </span>
                                        <span className="text-gray-700 font-semibold">{step.values}</span>
                                      </div>
                                    )}
                                    {step.note && (
                                      <div className="bg-white p-1.5 rounded border border-gray-100">
                                        <span className="text-gray-400 font-medium">{t("Notes")}: </span>
                                        <span className="text-gray-800 italic">"{step.note}"</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Ảnh bằng chứng kiểm định (nếu có) */}
                                {step.imageUrl && (
                                  <div className="mt-2">
                                    <img
                                      src={step.imageUrl}
                                      alt={step.title}
                                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              },
            ]}
          />
        </Card>
      </div>

      {/* BLOCKCHAIN METADATA FOOTER */}
      <div className="px-4 mt-6 text-center">
        <p className="text-gray-300 text-[9px] mt-4">
          Đỗ Minh Nhật & Nguyễn Thành Dương
        </p>
      </div>
    </div>
  );
}
