import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { StepTransit } from '@/generated/zod';

export const usePostTransit = () => {
  return useMutation({
    mutationFn: async (data: StepTransit) => {
      const res = await api.post<StepTransit & { blockchainId: string }>('/transit', data);
      return res.data;
    }
  });
}

export const usePostTransitConfirm = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { txHash: string } }) => {
      const res = await api.post<StepTransit>(`/transit/${id}/confirm`, data);
      return res.data;
    }
  });
}