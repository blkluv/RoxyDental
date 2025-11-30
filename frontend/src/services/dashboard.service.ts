import api from '@/lib/api';
import { DashboardData } from '@/types/user';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardService = {
  async getDoctorSummary(): Promise<ApiResponse<DashboardData>> {
    const response = await api.get<ApiResponse<DashboardData>>('/doctor/dashboard/summary');
    return response.data;
  }
};