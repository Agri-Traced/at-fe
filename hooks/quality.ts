import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { QualityTest } from '@/generated/zod';

export const usePostQualityTest = () => {  return useMutation({
    mutationFn: async (data: QualityTest) => {
      const res = await api.post<QualityTest & { blockchainId: string }>('/quality-test', data);
      return res.data;
    }
  });
}

export const usePostQualityTestConfirm = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { txHash: string } }) => {
      const res = await api.post<QualityTest>(`/quality-test/${id}/confirm`, data);
      return res.data;
    }
  });
}