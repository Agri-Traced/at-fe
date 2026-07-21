'use client';

import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import { useState } from "react";
import ConnectWalletButton from "@/app/components/ConnectWalletButton";
import { useRouter } from "next/router";
import { HomeOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [pathname, setPathname] = useState('/welcome');
  const { t } = useTranslation();
  const menuData = [
    {
      path: '/dashboard',
      name: t('Dashboard'),
      icon: <HomeOutlined />,
    },
    {
      name: t('Batch Procedures'),
      icon: <UnorderedListOutlined />,
      children: [
        {
          path: 'procedures',
          name: t('Batch Procedures')
        }
      ]
    }
  ];

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        title="Agri-Trace Blockchain"
        logo='/icon.png'
        location={{ pathname }}
        route={{
          path: '/',
          routes: menuData,
        }}
        menuItemRender={(item, dom) => (
          <a onClick={() => setPathname(item.path ?? '/')}>{dom}</a>
        )}
      >
        {/* Vùng chứa nội dung chính, tự động căn chỉnh và có breadcrumb */}
        <PageContainer
          header={{
            title: 'Batch',
            extra: [
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <ConnectWalletButton />
              </div>
            ]
          }}
        >
          <div className="bg-white p-4 rounded-lg shadow-md h-[85vh]">
            {children}
          </div>
        </PageContainer>
      </ProLayout>
    </div>
  );
};