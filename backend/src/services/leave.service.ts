import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class LeaveService {
  async getLeaveRequests(userId: string) {
    const leaves = await prisma.leaveRequest.findMany({
      where: { userId },
      include: {
        approver: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return leaves;
  }

  async createLeaveRequest(userId: string, data: any) {
    const leave = await prisma.leaveRequest.create({
      data: {
        userId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        leaveType: data.leaveType,
        reason: data.reason
      }
    });

    return leave;
  }
}