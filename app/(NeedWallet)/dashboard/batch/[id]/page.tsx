'use client';

import { useBatch } from '@/hooks/batchs';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function BatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useTranslation();
  const { data: batch, isLoading, error } = useBatch(id);

  // 1. Trạng thái đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Trạng thái lỗi hoặc không tìm thấy dữ liệu
  if (error || !batch) {
    return (
      <div className="max-w-xl mx-auto my-8 p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">
        <p className="font-semibold">{t('batch.notFound', 'Không tìm thấy thông tin lô hàng')}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm font-medium transition"
        >
          {t('common.back', 'Quay lại')}
        </button>
      </div>
    );
  }

  // 3. Giao diện chính: Thẻ thông tin + Các nút bấm thao tác
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header & Nút Quay lại */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('batch.detailTitle', 'Lô hàng')} #{id}
          </h1>
        </div>

        {/* Badge trạng thái */}
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
          {batch.status || t('batch.status.unknown', 'Chưa xác định')}
        </span>
      </div>

      {/* Thẻ tóm tắt thông tin lô hàng (Giúp giao diện không bị trống) */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-gray-400 uppercase font-semibold block">
            {t('batch.id', 'Mã lô')}
          </span>
          <span className="text-sm font-medium text-gray-800">{batch.id || id}</span>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase font-semibold block">
            {t('batch.createdAt', 'Ngày tạo')}
          </span>
          <span className="text-sm font-medium text-gray-800">
            {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        {/* Bạn có thể hiển thị thêm thông tin ngắn nếu muốn */}
        {batch.shipperCompany && (
          <div className="col-span-2">
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              {t('batch.shipCompany', 'Đơn vị vận chuyển')}
            </span>
            <span className="text-sm font-medium text-gray-800">{batch.shipperCompany?.companyName}</span>
            <span className="text-sm font-medium text-gray-800">{batch.shipperCompany?.location}</span>
          </div>
        )}44

        {batch.retailCompany && (
          <div className="col-span-2">
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              {t('batch.retailCompany', 'Đơn vị bán lẻ')}
            </span>
            <span className="text-sm font-medium text-gray-800">{batch.retailCompany?.companyName}</span>
            <span className="text-sm font-medium text-gray-800">{batch.retailCompany?.location}</span>
          </div>
        )}
      </div>

      {/* Cụm nút bấm thao tác tối giản */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={() => router.push(`/batches/${id}/edit`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition"
        >
          {t('common.edit', 'Chỉnh sửa')}
        </button>

        <button
          onClick={() => console.log('Assign shipper / Change status')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition shadow-sm"
        >
          {t('batch.actions.nextStep', 'Cập nhật trạng thái')}
        </button>
      </div>
    </div>
  );
}