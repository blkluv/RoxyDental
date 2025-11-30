export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  specialization?: string;
  education?: string;
  experience?: string;
  sipNumber?: string;
  sipStartDate?: string;
  sipEndDate?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardData {
  totalVisits: number;
  todayVisits: number;
  monthlyVisits: number;
  profile: UserProfile;
  schedules: ScheduleItem[];
  practiceStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  sipRemaining?: {
    percentage: number;
    years: number;
    months: number;
    days: number;
  };
}

export interface ScheduleItem {
  day: string;
  start: string;
  end: string;
  location: string;
}