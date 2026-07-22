import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Batch, User, StepTransit, Activity, QualityTest, Company, StepTemplate, ActivityStep, QualityStep } from '@/generated/zod';

export type UserRelation = User & {
  company: Company
}

export type TransitsRelation = StepTransit & {
  shipper: User;
}

export type QualityTestRelation = QualityTest & {
  batch: Batch;
  retailer: User;
  steps: QualityStep[];
}

export type ActivityRelation = Activity & {
  batch: Batch;
  steps: ActivityStep[];
}

export type BatchRelation = Batch & {
  farmer: UserRelation;
  transits: TransitsRelation[];
  activity: ActivityRelation | null;
  qualityTest: QualityTestRelation | null;
  shipperCompany: Company | null;
  retailCompany: Company | null;
}

export type BatchHarvest = Pick<Batch, 'expiryDate' | 'retailCompanyId' | 'quantity'>

export const usePutQualitySteps = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ batchId, data }: { batchId: string; data: Omit<StepTemplate, 'processTemplateId'>[] }) => {
      const res = await api.put<Batch>(`/batches/${batchId}/quality/steps`, { data });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePutActivitySteps = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ batchId, data }: { batchId: string; data: Omit<StepTemplate, 'processTemplateId'>[] }) => {
      const res = await api.put<Batch>(`/batches/${batchId}/activity/steps`, { data });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePostBatchAssignShipConfirm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { shipTxHash: string } }) => {
      const res = await api.post<Batch>(`/batches/${id}/assign-ship/confirm`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const usePostBatchAssignShip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { shipperCompanyId: string } }) => {
      const res = await api.post<Batch>(`/batches/${id}/assign-ship`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    }
  });
}

export const useCompanyBatches = (id: string, query: string) => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  return useQuery({
    queryKey: ['batches', id, query],
    queryFn: async () => {
      const { data } = await api.get<BatchRelation[]>(`/company/${id}/batches?${params.toString()}`);
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
    mutationFn: async ({ id, data }: { id: string; data: { retailTxHash: string } }) => {
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
    mutationFn: async ({ id, data }: { id: string; data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> }) => {
      const res = await api.post<Activity>(`/batches/${id}/log`, data);
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

const fetchBatchByUserId = async (id: string, query: string) => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  const { data } = await api.get<BatchRelation[]>(`/batches/user/${id}?${params.toString()}`);
  return data;
}

export const useBatchesByUserId = (id: string, query: string) => {
  return useQuery({
    queryKey: ['batches', query],
    queryFn: () => fetchBatchByUserId(id, query),
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
