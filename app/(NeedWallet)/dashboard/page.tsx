
'use client';

import { App, Table, TableColumnsType, Result, Tooltip, Button, Dropdown, Flex, Space, Input, Empty, Tag } from 'antd';
import { CarOutlined, CloseOutlined, CopyOutlined, MoreOutlined, PlusOutlined, SafetyOutlined, SnippetsFilled, SyncOutlined, TruckOutlined, UploadOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib/menu';
import { useState } from 'react';
import { Batch } from '@/generated/zod';
import { BatchRelation, useBatchesByUserId, useCompanyBatches } from '@/hooks/batchs';
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
import { AssignForm } from './components/AssignForm';
import { TransitForm } from './components/TransitForm';
import { QualityTestForm } from './components/QualityTestForm';
export default function BatchPage() {
  const { user } = useAuth();
  if (!user) return <div className="flex items-center justify-center h-full"><Loading message="Loading user data..." /></div>;
  const { t } = useTranslation();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [openAddLogModal, setOpenAddLogModal] = useState(false);
  const [openHarvestModal, setOpenHarvestModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openTransitModal, setOpenTransitModal] = useState(false);
  const [openQualityTestModal, setOpenQualityTestModal] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const { modal } = App.useApp();
  const { data, isLoading, isError, error } = user.role === 'FARMER'
    ? useBatchesByUserId(user.id)
    : useCompanyBatches(user.companyId)

  const filteredData = data ? data.filter((item) =>
    item.productName.toLowerCase().includes(searchInput.toLowerCase())
  ) : [];

  const action = (data: BatchRelation): MenuProps['items'] => [
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
      icon: <UploadOutlined />,
      hidden: user.role !== 'FARMER',
      disabled: data.status !== 'PLANTED',
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
      disabled: data.status !== 'PLANTED',
      onClick: () => {
        setSelectedBatchId(data.id);
        setUnit(data.unit);
        setOpenHarvestModal(true);
      }
    },
    {
      label: t('Confirm & Assign Shipper'),
      key: 'assign-shipper',
      icon: <TruckOutlined />,
      hidden: user.role !== 'RETAILER',
      onClick: () => {
        setSelectedBatchId(data.id);
        setOpenAssignModal(true);
      },
      disabled: data.status !== 'HARVESTED',
    },
    {
      label: t('Create Quality Test'),
      key: 'create-quality-test',
      icon: <SafetyOutlined />,
      hidden: user.role !== 'RETAILER',
      onClick: () => {
        setSelectedBatchId(data.id);
        setOpenQualityTestModal(true);
      },
      disabled: data.status !== 'IN_TRANSIT',
    },
    {
      label: t('Transit batch'),
      key: 'transit',
      icon: <CarOutlined />,
      hidden: user.role !== 'SHIPPER',
      onClick: () => {
        setSelectedBatchId(data.id);
        setLocation(data.farmer.company.location);
        setOpenTransitModal(true);
      },
      disabled: data.status !== 'IN_TRANSIT',
    }
  ].filter(item => !item.hidden);

  const columns: TableColumnsType<BatchRelation> = [
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
      render: (_, record) => {
        // Vì đã có Union Type sẵn từ IntelliSense, ta dùng thẳng String để so sánh cực kỳ sạch sẽ
        const colors: Record<Batch['category'], string> = {
          VEGETABLE: 'green',
          FRUIT: 'orange',
          GRAIN: 'gold',
          BEAN: 'brown', // Antd tự nhận diện nếu không có màu chuẩn, hoặc dùng mã Hex '#8B4513'
          HERB: 'lime',
          OTHER: 'default',
        };
        return <Tag color={colors[record.category]}>{record.category}</Tag>;
      },
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right', // Cột số luôn luôn căn phải theo UI/UX chuẩn
      render: (_, record) => (
        <span>
          {record.quantity} <span className="text-xs text-neutral-400">{record.unit}</span>
        </span>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const statusConfig: Record<Batch['status'], { color: string; text: string }> = {
          PLANTED: { color: 'processing', text: 'Đã gieo trồng' },
          HARVESTED: { color: 'warning', text: 'Đã thu hoạch' },
          IN_TRANSIT: { color: 'purple', text: 'Đang vận chuyển' },
          TESTING: { color: 'orange', text: 'Đang kiểm định' },
          RETAILING: { color: 'geekblue', text: 'Đang bán lẻ' },
          SOLD: { color: 'success', text: 'Đã bán hết' },
          ABORTED: { color: 'error', text: 'Hết hạn sử dụng' },
        };
        return <Tag color={statusConfig[record.status]?.color}>{statusConfig[record.status]?.text}</Tag>;
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
        <Table<BatchRelation>
          loading={isLoading}
          columns={columns}
          dataSource={filteredData}
          sticky={{ offsetHeader: 0 }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: <Empty description={t('No data')} />
          }}
          pagination={{
            defaultPageSize: 10,
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
      }} id={selectedBatchId} unit={unit} />
      <AssignForm open={openAssignModal} onClose={() => {
        setOpenAssignModal(false)
        setSelectedBatchId(null)
      }} id={selectedBatchId} />
      <TransitForm open={openTransitModal} onClose={() => {
        setOpenTransitModal(false)
        setSelectedBatchId(null)
      }} id={selectedBatchId} location={location} />
      <QualityTestForm open={openQualityTestModal} onClose={() => {
        setOpenQualityTestModal(false)
        setSelectedBatchId(null)
      }} id={selectedBatchId} />
    </>
  )
}