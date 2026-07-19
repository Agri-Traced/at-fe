import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Batch, User, StepTransit, ActivityLog, QualityTest, Company } from '@/generated/zod';

export type UserRelation = User & {
  company: Company
}

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
  farmer: UserRelation;
  transits: TransitsRelation[];
  activities: ActivityLogRelation[];
  qualityTest: QualityTestRelation | null;
}

export type BatchHarvest = Pick<Batch, 'expiryDate' | 'retailCompanyId' | 'quantity'>

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
    mutationFn: async ({ id, data }: { id: string; data: { plantTxHash: string } }) => {
      const res = await api.post<Batch>(`/batches/${id}/confirm`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePostBatchHarvestConfirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { harvestTxHash: string } }) => {
      const res = await api.post<Batch>(`/batches/${id}/harvest/confirm`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePostBatchHarvest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BatchHarvest }) => {
      const res = await api.post<Batch>(`/batches/${id}/harvest`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePostBatchActivityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'> }) => {
      const res = await api.post<ActivityLog>(`/batches/${id}/log`, data);
      return res.data;
    },
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
