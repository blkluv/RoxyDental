import { prisma } from '../config/database';
import { VisitStatus, Gender } from '../../generated/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CreatePatientData {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

interface CreateVisitData {
  visitDate: string;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
}

interface CreateVisitInput {
  patient: CreatePatientData;
  visit: CreateVisitData;
}

export class VisitService {
  async getVisits(page: number = 1, limit: number = 10, status?: VisitStatus) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              fullName: true,
              phone: true,
              gender: true
            }
          },
          nurse: {
            select: {
              id: true,
              fullName: true
            }
          }
        },
        orderBy: {
          visitDate: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.visit.count({ where })
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getVisitById(id: string) {
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        payments: true
      }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    return visit;
  }

  async createVisit(data: CreateVisitInput, nurseId: string) {
    const { patient, visit } = data;

    let patientRecord;

    if (patient.id) {
      patientRecord = await prisma.patient.findUnique({
        where: { id: patient.id }
      });

      if (!patientRecord) {
        throw new AppError('Pasien tidak ditemukan', 404);
      }
    } else {
      const patientNumber = `P${Date.now()}`;
      patientRecord = await prisma.patient.create({
        data: {
          patientNumber,
          fullName: patient.fullName,
          dateOfBirth: new Date(patient.dateOfBirth),
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          bloodType: patient.bloodType,
          allergies: patient.allergies,
          medicalHistory: patient.medicalHistory
        }
      });
    }

    const lastVisit = await prisma.visit.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    const visitNumber = lastVisit
      ? `V${parseInt(lastVisit.visitNumber.substring(1)) + 1}`
      : 'V1000';

    const queueNumber = await this.getNextQueueNumber();

    const newVisit = await prisma.visit.create({
      data: {
        patientId: patientRecord.id,
        nurseId,
        visitNumber,
        visitDate: new Date(visit.visitDate),
        queueNumber,
        status: VisitStatus.WAITING,
        chiefComplaint: visit.chiefComplaint,
        bloodPressure: visit.bloodPressure,
        notes: visit.notes
      },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    return newVisit;
  }

  async getNextQueueNumber(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastQueue = await prisma.visit.findFirst({
      where: {
        visitDate: {
          gte: today
        }
      },
      orderBy: {
        queueNumber: 'desc'
      }
    });

    return lastQueue ? lastQueue.queueNumber + 1 : 1;
  }

  async getQueue() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const queue = await prisma.visit.findMany({
      where: {
        visitDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS]
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
            fullName: true,
            phone: true
          }
        }
      },
      orderBy: {
        queueNumber: 'asc'
      }
    });

    return queue;
  }
}