'use client';

import { useMemo } from 'react';
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
import { Badge, Steps, Card, Progress, Typography, Space, Tooltip, Image } from 'antd';
import { Loading } from '@/app/components/Loading';
import { useTranslation } from 'react-i18next';
import { useBatch } from '@/hooks/batchs';
import { useTransaction } from 'wagmi';
import Link from 'next/link';

export default function TracePage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useTranslation();

  if (!id) return <div className="p-8 text-center">{t('Batch not found')}</div>;

  const { data, isLoading: loading } = useBatch(id);

  const transportSummary = useMemo(() => {
    if (!data || !data.transits || data.transits.length === 0) return null;
    // Tính nhiệt độ trung bình
    const avgTemp = data.transits.reduce((acc, curr) => acc + (curr.temperature ?? 0), 0) / data.transits.length;
    // Tìm nhiệt độ cao nhất
    const maxTemp = Math.max(...data.transits.map(t => t.temperature ?? 0));

    const avgHumidity = data.transits.reduce((acc, curr) => acc + (curr.humidity ?? 0), 0) / data.transits.length;
    const maxHumidity = Math.max(...data.transits.map(t => t.humidity ?? 0));
    // Kiểm tra xem tất cả các chặng có "đạt ngưỡng an toàn" không
    const isAllSafe = data.transits.every(t => (t.temperature ?? 0) >= 2 && (t.temperature ?? 0) <= 8);
    return { avgTemp, maxTemp, avgHumidity, maxHumidity, isAllSafe };
  }, [data?.transits]);

  if (loading) {
    return (
      <Loading message={t('Fetching trace data...')} />
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        {t('Batch not found')}
      </div>
    );
  }

  const current = data.status === 'PLANTED' ? 0 :
    data.status === 'HARVESTED' ? 1 :
      data.status === 'IN_TRANSIT' ? 2 :
        data.status === 'TESTING' ? 3 :
          data.status === 'RETAILING' ? 4 : 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white pb-12">
      {/* HEADER: Thương hiệu & Chứng thực Blockchain */}
      <div className="bg-green-600 text-white p-6 rounded-b-[2.5rem] shadow-lg text-center relative">
        <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1 backdrop-blur-sm">
          <SafetyCertificateOutlined /> Sepolia Testnet
        </div>
        <h1 className="text-2xl font-bold tracking-wide mt-4">AGRI TRACE</h1>
        <p className="text-green-100 text-sm mt-1">{t('Transparent Agri Trace for Agricultural Products')}</p>

        {/* Huy hiệu Verified cực kỳ uy tín */}
        <div className="mt-6 inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-full shadow-md font-semibold text-base">
          <CheckCircleOutlined className="text-green-500 text-lg animate-pulse" />
          {t('Origin Verified')}
        </div>
      </div>

      {/* THÔNG TIN SẢN PHẨM CHÍNH */}
      <div className="px-4 -mt-4">
        <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-400">{t('Batch ID')}: #{data.blockchainId || "Chưa đồng bộ"}</span>
            <Badge count="VietGAP" style={{ backgroundColor: '#1dad55' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{data.productName}</h2>
          <Image src={data.imageUrl} alt={data.productName} width='100%' height='auto' style={{ objectFit: 'contain' }} className="mt-3" />
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-base">
            <div>
              <p className="text-gray-400 text-sm">{t('Quantity')}</p>
              <p className="font-semibold text-gray-700">{data.quantity} {data.unit}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('Farmer')}</p>
              <p className="font-semibold text-gray-700 truncate">{data.farmer.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm"><CalendarOutlined />{t('Harvest Date')}</p>
              <p className="font-medium text-gray-700">{data.harvestDate ? new Date(data.harvestDate).toLocaleDateString() : "Chưa xác định"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm"><CalendarOutlined />{t('Expiry Date')}</p>
              <p className="font-medium text-red-500">{data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : "Chưa xác định"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* THÔNG SỐ CHUỖI CUNG ỨNG LẠNH (COLD CHAIN STATUS) */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DashboardOutlined className="text-green-600" />
          {t('Cold Chain Status')}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-sm text-gray-400">{t('Average Temperature')}</p>
            <p className="text-2xl font-bold text-blue-600">
              {`🌡️ ${transportSummary ? transportSummary.avgTemp.toFixed(1) + "°C" : "--"}`}
            </p>
          </Card>
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-sm text-gray-400">{t('Average Humidity')}</p>
            <p className="text-2xl font-bold text-blue-600">
              {`💧 ${transportSummary ? transportSummary.avgHumidity.toFixed(1) + "%" : "--"}`}
            </p>
          </Card>
          <Card className="shadow-sm border-0 text-center rounded-xl">
            <p className="text-sm text-gray-400">{t('Overall Journey Status')}</p>
            <p className={`text-base font-bold ${transportSummary?.isAllSafe ? 'text-green-600' : 'text-red-600'}`}>
              {`⚠️ ${transportSummary?.isAllSafe ? t('Safe') : t('Has Deviations')}`}
            </p>
          </Card>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <DeploymentUnitOutlined className="text-green-600" />
          {t('Agri Tracing Journey')}
        </h3>
        <Card className="shadow-sm border-0 rounded-2xl">
          <Steps
            orientation="vertical"
            current={current}
            items={[
              {
                title: <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-gray-800">1. {t('Seeding & Cultivation')}</span>
                  <Tooltip title={data.plantTxHash}>
                    <Typography.Text
                      copyable
                    >
                      <Link href={`https://sepolia.etherscan.io/tx/${data.plantTxHash}`} target="_blank" rel="noopener noreferrer">
                        {data.plantTxHash?.slice(0, 6)}...{data.plantTxHash?.slice(-4)}
                      </Link>
                    </Typography.Text>
                  </Tooltip>
                </div>,
                description:
                  <div className="text-sm text-gray-500 mt-1">
                    <p className="font-semibold text-green-600">{`${data.farmer.fullName} - ${data.farmer.company.companyName}`}</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>{`${t('Address')}: ${data.farmer.company.location}`}</li>
                      <li>{`${t('Planting Date')}: ${new Date(data.createdAt).toLocaleDateString()}`}</li>
                      <li>{`${t('Seed Variety')}: ${data.productVariety}`}</li>
                    </ul>
                    <p className="font-semibold text-gray-700 mt-2">{t('Cultivation History')}:</p>
                    {data.activities.length === 0 ? (
                      <div className="text-sm text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="font-semibold text-yellow-700">⚠ {t('No Activity Data Available')}</p>
                      </div>
                    ) : (
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {data.activities.map(act => (
                          <li key={act.id}>{`${new Date(act.timestamp).toLocaleString()} - ${act.description}`}</li>
                        ))}
                      </ul>
                    )}
                  </div>
              },
              {
                title: <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-gray-800">2. {t('Harvest & Packaging')}</span>
                  {data.harvestTxHash &&
                    <Tooltip title={data.harvestTxHash}>
                      <Typography.Text
                        copyable
                      >
                        <Link href={`https://sepolia.etherscan.io/tx/${data.harvestTxHash}`} target="_blank" rel="noopener noreferrer">
                          {data.harvestTxHash?.slice(0, 6)}...{data.harvestTxHash?.slice(-4)}
                        </Link>
                      </Typography.Text>
                    </Tooltip>
                  }
                </div>,
                description: !data.harvestTxHash ? (
                  <div className="text-sm text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">⚠ {t('No Activity Data Available')}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">
                    <p>{`${t('Date')}: ${data.harvestDate ? new Date(data.harvestDate).toLocaleDateString() : "Chưa xác định"}`}</p>
                    <p>{`${t('Quantity')}: ${`${data.quantity ?? "Chưa xác định"} ${data.unit ?? ""}`}`}</p>
                    <p>{`${t('Expiry Date')}: ${data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : "Chưa xác định"}`}</p>
                  </div>
                ),
              },
              {
                title: <span className="font-bold text-base text-gray-800">3. {t('Transportation')}</span>,
                description: data.transits && data.transits.length > 0 ? data.transits.map((transit) => (
                  <div className="text-sm text-gray-500 mt-1 space-y-1">
                    <p>{`${t('Shipped By')}: ${transit.shipper.fullName}`}</p>
                    <p>{`${t('Vehicle')}: ${transit.vehicleNumber}`}</p>
                    <p>{`${t('From Location')}: ${transit.fromLocation}`}</p>
                    <p>{`${t('To Location')}: ${transit.toLocation}`}</p>
                    <p className="text-gray-400 font-mono text-[10px]">{`${t('Blockchain Tx')}: ${transit.txHash}`}</p>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">⚠ {t('No Transportation Data Available')}</p>
                  </div>
                ),
              },
              {
                title: <span className="font-bold text-base text-gray-800">4. {t('Quality Testing & Retail')}</span>,
                description: data.qualityTest ? (
                  <div className="text-sm text-gray-500 mt-1 p-2.5 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-700">✓ {t('Result')}: {t('Meets Standards')}</p>
                    <p className="mt-1">{`${t('Approved By')}: ${data.qualityTest.retailer.fullName}`}</p>
                    <p className="italic text-gray-600">"{data.qualityTest.note}"</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-1">{`${t('Blockchain Tx')}: ${data.qualityTest.txHash}`}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-1 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-700">⚠ {t('Not Yet Tested')}</p>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {/* BLOCKCHAIN METADATA FOOTER */}
      <div className="px-4 mt-6 text-center">
        <p className="text-gray-300 text-[9px] mt-4">{t('Agri-Trace • Security by Smart Contract')}</p>
        <p className="text-gray-300 text-[9px] mt-4">Đỗ Minh Nhật & Nguyễn Thành Dương</p>
      </div>
    </div>
  );
}