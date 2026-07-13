import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { User } from '../generated/prisma/client';

const fetchUser = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
  });
};

const postUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data } = await api.post('/users', userData);
  return data;
}

export const usePostUser = () => {
  return useMutation({
    mutationFn: postUser,
  });
}

const putUser = async (userData: User) => {
  const { data } = await api.put(`/users/${userData.id}`, userData);
  return data;
}

export const usePutUser = () => {
  return useMutation({
    mutationFn: putUser,
  });
}