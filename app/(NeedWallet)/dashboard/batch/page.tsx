
'use client';

import { App, Table, TableColumnsType, Result, Tooltip, Button, Dropdown, Flex, Space, Input, theme, Select, Empty, Avatar, Typography, Tag } from 'antd';
import { CloseOutlined, CopyOutlined, DeleteOutlined, EditOutlined, ExclamationCircleFilled, MoreOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib/menu';
import { useMemo, useState } from 'react';
import { Batch } from '@/generated/zod';
import { useBatchesByUserId } from '@/hooks/batchs';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/auth';
import DashboardSkeleton from './components/DashboardSkeleton';
import { CreateForm } from './components/CreateForm';
import { Loading } from '@/app/components/Loading';

export default function BatchPage() {
  const { user } = useAuth();
  if (!user) return <Loading message="Loading user data..." />;
  const { t } = useTranslation();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { data, isLoading, isError, error } = useBatchesByUserId(user.id);
  const filteredData = data ? data.filter((item) =>
    item.productName.toLowerCase().includes(searchInput.toLowerCase())
  ) : [];


  const action = (data: Batch): MenuProps['items'] => [
    {
      label: t('Add activity log'),
      key: 'duplicate',
      icon: <CopyOutlined />,
    },
  ];

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
      <Flex justify='space-between' className='mb-3!' gap={10}>
        <Space>
          <Input
            placeholder={t('Input batch name')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
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
          <Button
            type='primary'
            icon={<SearchOutlined />}
          >
            {t('Search')}
          </Button>
        </Space>
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
    </>
  )
}