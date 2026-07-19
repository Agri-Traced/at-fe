import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Batch, User, StepTransit, ActivityLog, QualityTest } from '@/generated/zod';

export type TransitsRelation = StepTransit & {
  shipper: User;
}

export type QualityTestRelation = QualityTest & {
  batch: Batch;
  retailer: User;
}

export type ActivityLogRelation = ActivityLog & {
  batch: Batch;
  user: User;
}

export type BatchRelation = Batch & {
  farmer: User;
  transits: TransitsRelation[];
  activities: ActivityLogRelation[];
  qualityTest: QualityTestRelation | null;
}

export type BatchHarvest = Pick<Batch, 'expiryDate' | 'retailCompanyId' | 'quantity' | 'txHash'>

export const useCompanyBatches = (id: string) => {
  return useQuery({
    queryKey: ['batches', id],
    queryFn: async () => {
      const { data } = await api.get<BatchRelation[]>(`/company/${id}/batches`);
      return data;
    }
  });
}

export const usePostBatchConfirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: string }) => api.post<Batch, Batch>(`/batches/${id}/confirm`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePostBatchHarvest = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BatchHarvest }) => api.post<Batch, Batch>(`/batches/${id}/harvest`, data),
  });
}

export const usePostBatchActivityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'> }) => api.post<ActivityLog, ActivityLog>(`/batches/${id}/activity-logs`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
};

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
  const { data } = await api.get<BatchRelation[]>(`/batches/user/${id}`);
  return data;
}

export const useBatchesByUserId = (id: string) => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: () => fetchBatchByUserId(id),
  });
}

const fetchBatch = async (id: string) => {
  const { data } = await api.get<BatchRelation>(`/batches/${id}`);
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
