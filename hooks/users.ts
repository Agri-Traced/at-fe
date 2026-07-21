import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { User } from '../generated/prisma/client';

const fetchUser = async (id: string) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
};

const postUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data } = await api.post('/user', userData);
  return data;
}

export const usePostUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    }
  });
}

const putUser = async (userData: User) => {
  const { data } = await api.put(`/user/${userData.id}`, userData);
  return data;
}

export const usePutUser = () => {
  return useMutation({
    mutationFn: putUser,
  });
}