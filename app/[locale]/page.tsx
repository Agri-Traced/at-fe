'use client';

import { useState } from 'react';
import { ProLayout, PageContainer, DefaultFooter } from '@ant-design/pro-layout';
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const BasicLayout = () => {
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
        title="Agri-Trace Blockchain"
        logo='/logo.svg'
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
            title: 'Tiêu đề trang',
          }}
        >
          <div style={{ minHeight: '600px', backgroundColor: '#fff', padding: 24 }}>
            <Result
              icon={<SmileOutlined />}
              title="Chào mừng bạn đến với Agri-Trace Blockchain"
            />
          </div>
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default BasicLayout;