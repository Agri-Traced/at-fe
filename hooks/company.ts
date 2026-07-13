import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Company } from '@/generated/zod';

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

const postCompanyKey = async (id: string, key: string) => {
  const { data } = await api.post(`/company/${id}/key`, { key });
  return data;
};

export const usePostCompanyKey = () => {
  return useMutation({
    mutationFn: ({ id, key }: { id: string, key: string }) => postCompanyKey(id, key),
  });
}
