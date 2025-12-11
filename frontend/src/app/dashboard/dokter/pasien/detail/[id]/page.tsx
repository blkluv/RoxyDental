'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { treatmentService } from '@/services/treatment.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DetailProps {
  params: Promise<{ id: string }>;
}

interface Visit {
  id: string;
  visitNumber: string;
  queueNumber: number;
  visitDate: string;
  chiefComplaint: string;
  bloodPressure?: string;
  status: string;
  patient: {
    id: string;
    patientNumber: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    email?: string;
    address?: string;
    bloodType?: string;
    allergies?: string;
  };
  nurse: {
    id: string;
    fullName: string;
  };
  treatments?: Array<{
    id: string;
    diagnosis: string;
    treatmentPlan: string;
    notes?: string;
    treatmentDate: string;
    service?: {
      id: string;
      name: string;
      price: number;
    };
    performer?: {
      id: string;
      fullName: string;
    };
  }>;
}

export default function MedicalRecordDetailPage({ params }: DetailProps) {
  const resolvedParams = use(params);
  const visitId = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchVisitData();
  }, [visitId]);

  const fetchVisitData = async () => {
    try {
      setLoading(true);
      const response = await treatmentService.getVisitWithTreatments(visitId);
      setData(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data rekam medis',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTreatment = async () => {
    if (!selectedTreatmentId) return;

    try {
      await treatmentService.deleteTreatment(selectedTreatmentId);
      toast({
        title: 'Sukses',
        description: 'Treatment berhasil dihapus',
      });
      setDeleteDialogOpen(false);
      setSelectedTreatmentId(null);
      fetchVisitData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus treatment',
        variant: 'destructive',
      });
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!data || !data.patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Data tidak ditemukan</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detail Rekam Medis</h1>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-pink-600">Informasi Pasien</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">No. Pasien</p>
            <p className="font-semibold">{data.patient?.patientNumber || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nama Lengkap</p>
            <p className="font-semibold">{data.patient?.fullName || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Umur</p>
            <p className="font-semibold">
              {data.patient?.dateOfBirth ? `${calculateAge(data.patient.dateOfBirth)} tahun` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Jenis Kelamin</p>
            <p className="font-semibold">
              {data.patient?.gender === 'MALE' ? 'Laki-laki' : data.patient?.gender === 'FEMALE' ? 'Perempuan' : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">No. Telepon</p>
            <p className="font-semibold">{data.patient?.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{data.patient?.email || '-'}</p>
          </div>
          {data.patient?.bloodType && (
            <div>
              <p className="text-sm text-gray-500">Golongan Darah</p>
              <p className="font-semibold">{data.patient.bloodType}</p>
            </div>
          )}
          {data.patient?.allergies && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Alergi</p>
              <p className="font-semibold text-red-600">{data.patient.allergies}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-pink-600">Informasi Kunjungan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">No. Antrian</p>
            <p className="font-semibold">{data.queueNumber || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Perawat</p>
            <p className="font-semibold">{data.nurse?.fullName || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
            <p className="font-semibold">{data.visitDate ? formatDate(data.visitDate) : '-'}</p>
          </div>
          {data.bloodPressure && (
            <div>
              <p className="text-sm text-gray-500">Tekanan Darah</p>
              <p className="font-semibold">{data.bloodPressure}</p>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Keluhan Utama</p>
            <p className="font-semibold">{data.chiefComplaint || '-'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-pink-50 flex flex-row items-center justify-between">
          <CardTitle className="text-pink-600">Riwayat Treatment</CardTitle>
          <Button
            onClick={() => router.push(`/dashboard/dokter/pasien/detail/${visitId}/tambah-treatment`)}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Treatment
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {!data.treatments || data.treatments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada treatment untuk kunjungan ini</p>
          ) : (
            <div className="space-y-4">
              {data.treatments.map((treatment) => (
                <Card key={treatment.id} className="border-l-4 border-l-pink-600">
                  <CardContent className="pt-6">
                    <div className="flex justify-end mb-4 gap-2">
                      <Button
                        onClick={() =>
                          router.push(
                            `/dashboard/dokter/pasien/detail/${visitId}/${treatment.id}/edit-treatment/${treatment.id}`
                          )
                        }
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedTreatmentId(treatment.id);
                          setDeleteDialogOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Treatment</p>
                        <p className="font-semibold">
                          {treatment.treatmentDate ? formatDate(treatment.treatmentDate) : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dokter</p>
                        <p className="font-semibold">{treatment.performer?.fullName || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Diagnosis</p>
                        <p className="font-semibold">{treatment.diagnosis || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Rencana Treatment</p>
                        <p className="font-semibold">{treatment.treatmentPlan || '-'}</p>
                      </div>
                      {treatment.notes && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Catatan</p>
                          <p className="font-semibold">{treatment.notes}</p>
                        </div>
                      )}
                      {treatment.service && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Layanan</p>
                          <p className="font-semibold">
                            {treatment.service.name} - {formatCurrency(treatment.service.price)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus treatment ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTreatment} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}