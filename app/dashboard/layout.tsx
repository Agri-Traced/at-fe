'use client';

import ProLayout, { DefaultFooter, PageContainer } from "@ant-design/pro-layout";
import { useState } from "react";
import { HomeOutlined, InboxOutlined } from "@ant-design/icons";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [pathname, setPathname] = useState('/welcome');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuData = [
    {
      path: '/',
      name: 'Welcome',
      icon: <HomeOutlined />,
    },
    {
      path: '/batch',
      name: 'Batch',
      icon: <InboxOutlined />,
    }
  ];

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        title="gri-Trace Blockchain"
        logo='/icon.png'
        location={{ pathname }}
        route={{
          path: '/',
          routes: menuData,
        }}
        menuItemRender={(item, dom) => (
          <a onClick={() => setPathname(item.path ?? '/')}>{dom}</a>
        )}
        // Tùy chỉnh Footer
        footerRender={() => (
          <DefaultFooter
            copyright="2026 Ant Design Pro"
            links={[
              {
                key: 'Agri Trace',
                title: 'Agri Trace',
                href: '/',
                blankTarget: true,
              },
            ]}
          />
        )}
      >
        {/* Vùng chứa nội dung chính, tự động căn chỉnh và có breadcrumb */}
        <PageContainer
          header={{
            title: 'Batch',
          }}
        >
          {children}
        </PageContainer>
      </ProLayout>
    </div>
  );
};