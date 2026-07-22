'use client';

import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import { useState } from "react";
import ConnectWalletButton from "@/app/components/ConnectWalletButton";
import { ArrowRightOutlined, HomeOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth";
import { BatchStatusSchema } from "@/generated/zod";
import { useRouter, useSearchParams } from "next/navigation";

const formatStatus = (label: string) => {
  if (!label) return '';
  const lower = label.toLowerCase();
  const withSpaces = lower.replace(/_/g, ' ');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [pathname, setPathname] = useState('/welcome');
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const BATCH_STATUS = BatchStatusSchema.options.map((option) => ({
    value: option,
    label: formatStatus(t(option)),
  }));

  const menuData = [
    {
      key: 'dashboard',
      path: '/dashboard',
      name: t('Dashboard'),
      icon: <HomeOutlined />,
    },
    {
      key: 'farmer',
      name: t('Farmers Batches'),
      icon: <UnorderedListOutlined />,
      hideInMenu: user?.role !== 'FARMER',
      children: BATCH_STATUS.map((option) => ({
        key: option.value,
        path: `/dashboard/farmer?query=${option.value}`,
        name: query === option.value ? <span><ArrowRightOutlined /> {option.label}</span> : option.label,
      }))
    },
    {
      key: 'shipper',
      name: t('Shippers Batches'),
      icon: <UnorderedListOutlined />,
      hideInMenu: user?.role !== 'SHIPPER',
      children: BATCH_STATUS.filter((option) => option.value === 'IN_TRANSIT').map((option) => ({
        key: option.value,
        path: `/dashboard/shipper?query=${option.value}`,
        name: query === option.value ? <span><ArrowRightOutlined /> {option.label}</span> : option.label,
      }))
    },
    {
      key: 'retailer',
      name: t('Retailers Batches'),
      icon: <UnorderedListOutlined />,
      hideInMenu: user?.role !== 'RETAILER',
      children: BATCH_STATUS.filter((option) => option.value !== 'PLANTED').map((option) => ({
        key: option.value,
        path: `/dashboard/retailer?query=${option.value}`,
        name: query === option.value ? <span><ArrowRightOutlined /> {option.label}</span> : option.label,
      }))
    }
  ];

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        title="Agri-Trace Blockchain"
        logo='/icon.png'
        collapsed={collapsed}
        onCollapse={setCollapsed}
        location={{ pathname }}
        route={{
          path: '/',
          routes: menuData,
        }}
        menuProps={{
          openKeys: collapsed ? [] : ['farmer', 'shipper', 'retailer'],
        }}
        menuItemRender={(item, dom) => (
          <a onClick={() => {
            setPathname(item.path || '/welcome');
            router.push(item.path || '/welcome');
          }}>
            {dom}
          </a>
        )}>
        <PageContainer
          header={{
            title: `Batch - ${query}`,
            extra: [
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '1rem', alignItems: 'center' }} key="user-info">
                <span className="font-bold">{`${user?.fullName} - ${user?.role}`}</span>
                <ConnectWalletButton />
              </div>
            ]
          }}
        >
          <div className="bg-white p-4 rounded-lg shadow-md min-h-[87vh]">
            {children}
          </div>
        </PageContainer>
      </ProLayout>
    </div>
  );
};