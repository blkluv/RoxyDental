import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class PatientService {
  async getPatients(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { patientNumber: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } }
          ]
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        select: {
          id: true,
          patientNumber: true,
          fullName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              visits: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.patient.count({ where })
    ]);

    return {
      patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          include: {
            nurse: {
              select: {
                fullName: true
              }
            }
          },
          orderBy: {
            visitDate: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            visits: true,
            treatments: true
          }
        }
      }
    });

    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }

    return patient;
  }

  async getPatientRecords(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }

    const treatments = await prisma.treatment.findMany({
      where: { patientId },
      include: {
        visit: {
          select: {
            visitNumber: true,
            visitDate: true
          }
        },
        service: {
          select: {
            serviceName: true,
            category: true
          }
        },
        performer: {
          select: {
            fullName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      patient,
      treatments
    };
  }

  async createTreatment(patientId: string, data: any, performedBy: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }

    const visit = await prisma.visit.findUnique({
      where: { id: data.visitId }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      throw new AppError('Layanan tidak ditemukan', 404);
    }

    const subtotal = service.basePrice.toNumber() * data.quantity - (data.discount || 0);

    const treatment = await prisma.treatment.create({
      data: {
        visitId: data.visitId,
        patientId,
        serviceId: data.serviceId,
        performedBy,
        toothNumber: data.toothNumber,
        diagnosis: data.diagnosis,
        treatmentNotes: data.treatmentNotes,
        quantity: data.quantity,
        unitPrice: service.basePrice,
        discount: data.discount || 0,
        subtotal,
        images: data.images || []
      },
      include: {
        service: true,
        performer: {
          select: {
            fullName: true
          }
        }
      }
    });

    await prisma.visit.update({
      where: { id: data.visitId },
      data: {
        totalCost: {
          increment: subtotal
        }
      }
    });

    const commissionAmount = (subtotal * service.commissionRate.toNumber()) / 100;

    await prisma.commission.create({
      data: {
        userId: performedBy,
        treatmentId: treatment.id,
        baseAmount: subtotal,
        commissionRate: service.commissionRate,
        commissionAmount,
        periodMonth: new Date().getMonth() + 1,
        periodYear: new Date().getFullYear()
      }
    });

    return treatment;
  }
}