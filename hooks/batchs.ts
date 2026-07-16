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
    queryKey: ['batches-user'],
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
  const queryClient = useQueryClient(); // Đúng quy tắc React Hook!
  return useMutation({
    mutationFn: postBatch,
    onSuccess: () => {
      // Tự động xoá cache cũ để re-fetch danh sách mới ngay khi tạo Batch thành công
      queryClient.invalidateQueries({ queryKey: ['batches-user'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}