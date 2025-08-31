import axios from 'axios';
import { User } from './users.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const UsersApi = {
  getUsersPaginated: {
    key: (page: number, limit: number) =>
      ['usersApi', 'getUsersPaginated', page, limit] as const,
    fn: async (
      page: number = 1,
      limit: number = 8
    ): Promise<{ users: User[]; total: number; totalPages: number }> => {
      const params = new URLSearchParams({
        _page: page.toString(),
        _limit: limit.toString(),
      });

      const response = await axios.get<User[]>(
        `${API_BASE_URL}/users?${params}`
      );
      const users = response.data;
      const totalCount = parseInt(response.headers['x-total-count'] as string);

      return {
        users,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    },
  },

  getUserById: {
    key: (id: number) => ['usersApi', 'getUserById', id] as const,
    fn: async (id: number): Promise<User> => {
      const response = await axios.get<User>(`${API_BASE_URL}/users/${id}`);
      return response.data;
    },
  },

  createUser: {
    key: ['usersApi', 'createUser'] as const,
    fn: async (userData: Omit<User, 'id'>): Promise<User> => {
      const response = await axios.post<User>(
        `${API_BASE_URL}/users`,
        userData
      );
      return response.data;
    },
  },

  updateUser: {
    key: (id: number) => ['usersApi', 'updateUser', id] as const,
    fn: async ({ id, ...userData }: User): Promise<User> => {
      const response = await axios.put<User>(
        `${API_BASE_URL}/users/${id}`,
        userData
      );
      return response.data;
    },
  },

  deleteUser: {
    key: (id: number) => ['usersApi', 'deleteUser', id] as const,
    fn: async (id: number): Promise<void> => {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
    },
  },
};
