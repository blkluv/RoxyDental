import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { ScheduleService } from '../services/schedule.service';
import { successResponse } from '../utils/response.util';

const scheduleService = new ScheduleService();

export class ScheduleController {
  async getSchedules(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.query;
      const schedules = await scheduleService.getSchedules(req.user!.id, type as any);
      res.json(successResponse('Jadwal berhasil diambil', schedules));
    } catch (error) {
      next(error);
    }
  }

  async createSchedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await scheduleService.createSchedule(req.user!.id, req.body);
      res.status(201).json(successResponse('Jadwal berhasil ditambahkan', schedule));
    } catch (error) {
      next(error);
    }
  }

  async getActivities(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activities = await scheduleService.getActivities(req.user!.id);
      res.json(successResponse('Aktivitas berhasil diambil', activities));
    } catch (error) {
      next(error);
    }
  }

  async getMeetings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const meetings = await scheduleService.getMeetings(req.user!.id);
      res.json(successResponse('Jadwal pertemuan berhasil diambil', meetings));
    } catch (error) {
      next(error);
    }
  }
}