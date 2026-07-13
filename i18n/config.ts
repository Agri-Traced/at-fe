'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import vi from './locales/vi.json';

i18n
  .use(LanguageDetector) // Tự động chọn ngôn ngữ
  .use(initReactI18next) // Kết nối với React
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: {} } // Thêm các bản dịch cho tiếng Anh nếu cần
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React đã tự chống XSS rồi
    }
  });

export default i18n;