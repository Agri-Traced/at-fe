'use client';

import '../i18n/config';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  const antdLocale = i18n.language?.startsWith('vi') ? viVN : enUS;

  return (
    <ConfigProvider locale={antdLocale} >
      {children}
    </ConfigProvider>
  );
}

export { I18nProvider };