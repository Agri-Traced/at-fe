import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Batch } from '../generated/prisma/client';

const fetchBatches = async () => {
  const { data } = await api.get('/batches');
  return data;
};

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: fetchBatches,
  });
};

const fetchBatchByUserId = async (id: string) => {
  const { data } = await api.get<Batch[]>(`/batches/user/${id}`);
  return data;
}

export const useBatchesByUserId = (id: string) => {
  return useQuery({
    queryKey: ['batches', 'user', id],
    queryFn: () => fetchBatchByUserId(id),
  });
}

const fetchBatch = async (id: string) => {
  const { data } = await api.get(`/batches/${id}`);
  return data;
};

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: ['batches', id],
    queryFn: () => fetchBatch(id),
  });
}

const postBatch = async (batchData: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data } = await api.post('/batches', batchData);
  return data;
}

export const usePostBatch = () => {
  return useMutation({
    mutationFn: postBatch,
  });
}