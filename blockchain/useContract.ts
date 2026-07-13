'use client';

import { useState } from 'react';
import { getSignerContract, getReadOnlyContract } from './config';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

export function useContract() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { notification } = App.useApp();

  // Hàm thực thi các tác vụ GHI dữ liệu (Đẩy batch, chuyển trạng thái...)
  const executeWrite = async (callback: (contract: any) => Promise<any>) => {
    setLoading(true);
    try {
      const contract = await getSignerContract();
      const result = await callback(contract);
      return result;
    } catch (error: any) {
      console.error("Blockchain Write Error:", error);
      if (error.code === 'ACTION_REJECTED') {
        notification.error({
          message: t('You have rejected the transaction on your wallet.'),
          showProgress: true,
          placement: 'bottomRight'
        });
      } else {
        notification.error({
          message: t('An error occurred while interacting with the blockchain.'),
          showProgress: true,
          placement: 'bottomRight'
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Hàm thực thi các tác vụ ĐỌC dữ liệu (Xem thông tin batch)
  const executeRead = async (callback: (contract: any) => Promise<any>) => {
    try {
      const contract = getReadOnlyContract();
      return await callback(contract);
    } catch (error) {
      console.error("Blockchain Read Error:", error);
      throw error;
    }
  };

  return { executeWrite, executeRead, loading };
}