import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Company } from '@/generated/zod';

export const useCompaniesRetail = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await api.get<Company[]>('/company/retail');
      return data;
    }
  });
};

export const useCompaniesShip = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await api.get<Company[]>('/company/ship');
      return data;
    }
  });
};

const fetchCompany = async (id: string) => {
  const { data } = await api.get<Omit<Company, 'protectedKey'>>(`/company/${id}`);
  return data;
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompany(id),
  });
}

export const usePostCompanyKey = () => {
  return useMutation({
    mutationFn: async ({ id, key, role }: { id: string, key: string, role: string }) => {
      const { data } = await api.post(`/company/key`, { id, key, role });
      return data;
    }
  });
}
