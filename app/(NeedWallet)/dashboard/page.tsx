
'use client';

import { App, Table, TableColumnsType, Result, Tooltip, Button, Dropdown, Flex, Space, Input, Empty, Typography, Tag } from 'antd';
import { BookFilled, CloseOutlined, CopyOutlined, EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined, SnippetsFilled, SyncOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib/menu';
import { useState } from 'react';
import { Batch } from '@/generated/zod';
import { useBatchesByUserId, useCompanyBatches } from '@/hooks/batchs';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/auth';
import DashboardSkeleton from './components/DashboardSkeleton';
import { CreateForm } from './components/CreateForm';
import { Loading } from '@/app/components/Loading';
import Link from 'next/link';
import { QRBlock } from '@/app/components/QRBlock';
import { AddLogForm } from './components/AddLogForm';
import { HarvestForm } from './components/HarvestForm';
export default function BatchPage() {
  const { user } = useAuth();
  if (!user) return <div className="flex items-center justify-center h-full"><Loading message="Loading user data..." /></div>;
  const { t } = useTranslation();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [openAddLogModal, setOpenAddLogModal] = useState(false);
  const [openHarvestModal, setOpenHarvestModal] = useState(false);
  const { modal } = App.useApp();
  const { data, isLoading, isError, error } = user.role === 'FARMER'
    ? useBatchesByUserId(user.id)
    : useCompanyBatches(user.companyId)

  const filteredData = data ? data.filter((item) =>
    item.productName.toLowerCase().includes(searchInput.toLowerCase())
  ) : [];

  const action = (data: Batch): MenuProps['items'] => [
    {
      label: t('Get QR Code'),
      key: 'qr',
      icon: <CopyOutlined />,
      onClick: () => {
        modal.info({
          icon: null,
          title: <span>{`${t('Batch:')} ${data.productName}`}</span>,
          content:
            <div className="flex flex-col gap-2">
              <QRBlock id={data.id} />
            </div>,
        });
      }
    },
    {
      label: t('Add activity log'),
      key: 'add-log',
      icon: <BookFilled />,
      hidden: user.role !== 'FARMER',
      onClick: () => {
        setSelectedBatchId(data.id);
        setOpenAddLogModal(true);
      }
    },
    {
      label: t('Harvest batch'),
      key: 'harvest',
      icon: <SnippetsFilled />,
      hidden: user.role !== 'FARMER',
      onClick: () => {
        setSelectedBatchId(data.id);
        setOpenHarvestModal(true);
      }
    },
    {
      label: t('Assign'),
      key: 'assign-shipper',
      icon: <EditOutlined />,
      hidden: user.role !== 'RETAILER',
    },
  ].filter(item => !item.hidden);

  const columns: TableColumnsType<Batch> = [
    {
      title: t('No'),
      dataIndex: 'key',
      key: 'key',
      width: '5%',
      render: (_, record, index) => index + 1,
    },
    {
      title: t('Product Name'),
      dataIndex: 'productName',
      key: 'productName',
      className: 'font-medium text-neutral-800',
      fixed: 'left',
      render: (_, record) => (
        <Tooltip title={record.productName}>
          <Link href={`trace/${record.id}`} className="truncate max-w-50">
            {record.productName}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: t('Category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: Batch['category']) => {
        // Vì đã có Union Type sẵn từ IntelliSense, ta dùng thẳng String để so sánh cực kỳ sạch sẽ
        const colors: Record<Batch['category'], string> = {
          VEGETABLE: 'green',
          FRUIT: 'orange',
          GRAIN: 'gold',
          BEAN: 'brown', // Antd tự nhận diện nếu không có màu chuẩn, hoặc dùng mã Hex '#8B4513'
          HERB: 'lime',
          OTHER: 'default',
        };
        return <Tag color={colors[category]}>{category}</Tag>;
      },
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right', // Cột số luôn luôn căn phải theo UI/UX chuẩn
      render: (quantity: number, record) => (
        <span>
          {quantity.toLocaleString()} <span className="text-xs text-neutral-400">{record.unit}</span>
        </span>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Batch['status']) => {
        const statusConfig: Record<Batch['status'], { color: string; text: string }> = {
          PLANTED: { color: 'processing', text: 'Đã gieo trồng' },
          HARVESTED: { color: 'warning', text: 'Đã thu hoạch' },
          IN_TRANSIT: { color: 'purple', text: 'Đang vận chuyển' },
          TESTING: { color: 'orange', text: 'Đang kiểm định' },
          RETAILING: { color: 'geekblue', text: 'Đang bán lẻ' },
          SOLD: { color: 'success', text: 'Đã bán hết' },
          ABORTED: { color: 'error', text: 'Hết hạn sử dụng' },
        };
        return <Tag color={statusConfig[status]?.color}>{statusConfig[status]?.text}</Tag>;
      },
    },
    {
      title: t('Harvest Date'),
      dataIndex: 'harvestDate',
      key: 'harvestDate',
      render: (date: Date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: t('Expiry Date'),
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: Date | null) => (date ? dayjs(date).format('DD/MM/YYYY') : <span className="text-neutral-400">{t('No data')}</span>),
    },
    {
      key: 'config',
      width: '5%',
      render: (_, record) => {
        return <Dropdown menu={{ items: action(record), expandIcon: () => null, triggerSubMenuAction: 'click' }} placement="bottomRight" trigger={['click']}>
          <Button
            type='text' shape='circle' icon={<MoreOutlined style={{ fontSize: 20 }} />} />
        </Dropdown>
      }
    },
  ];

  return (
    <>
      <Flex wrap justify='space-between' className='mb-3!' gap={10}>
        <div className='sm:w-[40%] w-full flex items-center gap-3'>
          <Input.Search
            placeholder={t('Input batch name')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Space>
            <Button
              shape='circle'
              onClick={() => {
                setSearchInput('');
              }}
            >
              <CloseOutlined />
            </Button>
            <Button
              shape='circle'
            >
              <SyncOutlined />
            </Button>
          </Space>
        </div>
        <Button type='primary' onClick={() => setOpenCreateModal(true)}>
          <PlusOutlined />
          {t('New batch')}
        </Button>
      </Flex>
      {/* SECTION 2: RECENT ITEMS */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <Result
          status="error"
          title={error?.message || t('Failed to load data')}
        />
      ) : (
        <Table<Batch>
          loading={isLoading}
          columns={columns}
          dataSource={filteredData}
          sticky={{ offsetHeader: 0 }}
          scroll={{ y: 'calc(100vh - 330px)' }}
          locale={{
            emptyText: <Empty description={t('No data')} />
          }}
          pagination={{
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
          }}
        />
      )}
      <CreateForm open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <AddLogForm open={openAddLogModal} onClose={() => {
        setOpenAddLogModal(false)
        setSelectedBatchId(null)
      }} id={selectedBatchId} />
      <HarvestForm open={openHarvestModal} onClose={() => {
        setOpenHarvestModal(false)
        setSelectedBatchId(null)
      }} id={selectedBatchId} />
    </>
  )
}