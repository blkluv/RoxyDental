"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { visitService, Visit } from "@/services/visit.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";

interface PageProps {
  params: { rmNo: string };
}

export default function MedicalRecordDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();

  // rmNo dari URL biasanya sudah ter-decode oleh Next,
  // tapi kalau sebelumnya kamu push pakai encodeURIComponent,
  // aman kita decode ulang (try/catch).
  const rmNo = useMemo(() => {
    try {
      return decodeURIComponent(params.rmNo || "");
    } catch {
      return params.rmNo || "";
    }
  }, [params.rmNo]);

  const [data, setData] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rmNo) return;
    fetchVisitData(rmNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rmNo]);

  const fetchVisitData = async (mrn: string) => {
    try {
      setLoading(true);

      // NOTE:
      // visitService.getVisitByMedicalRecord(mrn) harus ada di visit.service.ts
      // dan endpoint backend harus mengembalikan Visit (plus patient, doctor, nurse, treatments).
      const visit = await visitService.getVisitByMedicalRecord(mrn);

      setData(visit ?? null);
    } catch (error: any) {
      console.error("Error fetching visit data:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Gagal memuat data rekam medis (cek endpoint backend / token).",
        variant: "destructive",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "-";
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      if (Number.isNaN(birthDate.getTime())) return "-";

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return `${age} tahun`;
    } catch {
      return "-";
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    try {
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return "-";
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
        </div>
      </div>
    );
  }

  // Jangan blok akses kalau incomplete.
  // Kalau data null, tampilkan info "tidak ditemukan" + tombol kembali
  if (!data) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] px-6">
          <p className="text-gray-600 mb-2 font-semibold">
            Data rekam medis tidak ditemukan
          </p>
          <p className="text-sm text-gray-500 mb-6 text-center">
            RM: <span className="font-mono">{rmNo || "-"}</span>
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const patient = data.patient;
  const doctorName = data.doctor?.fullName || "-";
  const nurseName = data.nurse?.fullName || "-";

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-pink-900">Detail Rekam Medis</h1>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        {/* Informasi Pasien */}
        <Card>
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-600">Informasi Pasien</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">No. Rekam Medis</p>
              <p className="font-semibold">
                {(patient as any)?.medicalRecordNumber || rmNo || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">No. ID</p>
              <p className="font-semibold">{patient?.patientNumber || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-semibold">{patient?.fullName || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Umur</p>
              <p className="font-semibold">{calculateAge(patient?.dateOfBirth)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Jenis Kelamin</p>
              <p className="font-semibold">
                {patient?.gender === "L"
                  ? "Laki-laki"
                  : patient?.gender === "P"
                  ? "Perempuan"
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">No. Telepon</p>
              <p className="font-semibold">{patient?.phone || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{patient?.email || "-"}</p>
            </div>

            {(patient as any)?.bloodType ? (
              <div>
                <p className="text-sm text-gray-500">Golongan Darah</p>
                <p className="font-semibold">{(patient as any).bloodType}</p>
              </div>
            ) : null}

            {(patient as any)?.allergies ? (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Alergi</p>
                <p className="font-semibold text-red-600">
                  {(patient as any).allergies}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Informasi Kunjungan */}
        <Card>
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-600">Informasi Kunjungan</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
              <p className="font-semibold">{formatDate(data.visitDate)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dokter Pemeriksa</p>
              <p className="font-semibold">{doctorName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Perawat</p>
              <p className="font-semibold">{nurseName}</p>
            </div>

            {data.bloodPressure ? (
              <div>
                <p className="text-sm text-gray-500">Tekanan Darah</p>
                <p className="font-semibold">{data.bloodPressure}</p>
              </div>
            ) : null}

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Keluhan Utama</p>
              <p className="font-semibold">{data.chiefComplaint || "-"}</p>
            </div>

            {data.notes ? (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Catatan</p>
                <p className="font-semibold">{data.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Detail Pemeriksaan / Treatments */}
        <Card>
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-600">Detail Pemeriksaan</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {!data.treatments || data.treatments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Belum ada treatment untuk kunjungan ini
              </p>
            ) : (
              <div className="space-y-4">
                {data.treatments.map((treatment: any) => (
                  <Card key={treatment.id} className="border-l-4 border-l-pink-600">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Tanggal Treatment</p>
                          <p className="font-semibold">
                            {formatDate(treatment.createdAt)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Dokter</p>
                          <p className="font-semibold">
                            treatment.performer?.fullName || doctorName
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Layanan / Tindakan</p>
                          <p className="font-semibold">
                            {treatment.service?.serviceName ||
                              treatment.treatmentNotes ||
                              data.chiefComplaint ||
                              "-"}
                          </p>
                        </div>

                        {treatment.toothNumber ? (
                          <div>
                            <p className="text-sm text-gray-500">Nomor Gigi</p>
                            <p className="font-semibold">{treatment.toothNumber}</p>
                          </div>
                        ) : null}

                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Diagnosis</p>
                          <p className="font-semibold">{treatment.diagnosis || "-"}</p>
                        </div>

                        {treatment.treatmentNotes ? (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Hasil Pemeriksaan</p>
                            <p className="font-semibold">{treatment.treatmentNotes}</p>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
