'use client';

import ProLayout, { DefaultFooter, PageContainer } from "@ant-design/pro-layout";
import { Result } from "antd";
import { useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import TransactionModal from "@/app/components/TransactionModal";
import { CreateForm } from "./components/CreateForm";

export default function BatchsPage() {
  const [pathname, setPathname] = useState('/welcome');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cấu hình menu (Thường sẽ được truyền từ router)
  const menuData = [
    {
      path: '/',
      name: 'Welcome',
      icon: <SmileOutlined />,
    },
    {
      path: '/public-scan',
      name: 'Public Scan',
      icon: <SmileOutlined />,
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
          <div style={{ minHeight: '600px', backgroundColor: '#fff', padding: 24 }}>
            <CreateForm onNext={() => { }} />
          </div>
          <TransactionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSign={() => { }} />
        </PageContainer>
      </ProLayout>
    </div>
  );
};