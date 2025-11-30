import api from '@/lib/api';
import { UserProfile } from '@/types/user';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<ApiResponse<UserProfile>>('/users/profile');
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const response = await api.put<ApiResponse<UserProfile>>('/users/profile', data);
    return response.data;
  }
};