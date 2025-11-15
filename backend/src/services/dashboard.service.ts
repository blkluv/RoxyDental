import { prisma } from '../config/database';
import { VisitStatus } from '../../generated/prisma';
import { getStartOfDay, getEndOfDay, getCurrentMonth, getCurrentYear } from '../utils/date.util';

export class DashboardService {
  async getDoctorSummary(userId: string) {
    const today = new Date();
    const startOfDay = getStartOfDay(today);
    const endOfDay = getEndOfDay(today);
    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();

    const [
      todayVisits,
      activeQueue,
      totalPatients,
      monthlyCommission
    ] = await Promise.all([
      prisma.visit.count({
        where: {
          visitDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: startOfDay,
            lte: endOfDay
          },
          status: {
            in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS]
          }
        }
      }),
      prisma.patient.count(),
      prisma.commission.aggregate({
        where: {
          userId,
          periodMonth: currentMonth,
          periodYear: currentYear
        },
        _sum: {
          commissionAmount: true
        }
      })
    ]);

    return {
      todayVisits,
      activeQueue,
      totalPatients,
      monthlyCommission: monthlyCommission._sum.commissionAmount || 0
    };
  }
}