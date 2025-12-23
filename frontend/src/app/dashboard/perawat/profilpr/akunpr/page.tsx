"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DoctorNavbar from "@/components/ui/navbarpr";
import SettingsSidebar from "@/components/ui/SettingsSidebarpr";
import AuthGuard from "@/components/AuthGuard";
import { nurseProfileService, NurseProfile, UpdateProfileData } from "@/services/nurse-profile.service";
import { useRouter } from "next/navigation"; // Add this import

function SettingsAccountPageContent() {
  const router = useRouter(); // Add router hook
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    education: '',
    experience: '',
    sipNumber: '',
    sipStartDate: '',
    sipEndDate: '',
  });

  // Add logout function
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirect to login page
    router.push('/login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await nurseProfileService.getProfile();
      setProfile(response.data);
      setPreviewPhoto(response.data.profilePhoto || null);
      
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        phone: response.data.phone,
        specialization: response.data.specialization || '',
        education: response.data.education || '',
        experience: response.data.experience || '',
        sipNumber: response.data.sipNumber || '',
        sipStartDate: response.data.sipStartDate ? new Date(response.data.sipStartDate).toISOString().split('T')[0] : '',
        sipEndDate: response.data.sipEndDate ? new Date(response.data.sipEndDate).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => setPreviewPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData: UpdateProfileData = {
        ...formData,
        profilePhoto: previewPhoto || undefined
      };

      await nurseProfileService.updateProfile(updateData);
      
      setConfirmSaveOpen(false);
      setSuccessSaveOpen(true);
      
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setConfirmDeleteOpen(false);
      
      const response = await nurseProfileService.deleteAccount();
      
      if (response.success) {
        setSuccessDeleteOpen(true);
        
        setTimeout(() => {
          // Use the logout function
          handleLogout();
        }, 2000);
      } else {
        alert('Gagal menghapus akun');
        setDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Terjadi kesalahan saat menghapus akun');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-pink-600 mx-auto" />
            <p className="mt-4 text-pink-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-pink-900">Data profil tidak dapat dimuat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Add the onLogout prop here */}
          <SettingsSidebar 
            activeMenu="informasi-akun" 
            setActiveMenu={() => {}} 
            onLogout={handleLogout} 
          />

          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-100 p-4">
                <h2 className="text-xl font-bold text-pink-900">Informasi Akun</h2>
                <p className="text-sm text-pink-600">Update data dan profil akun Anda</p>
              </CardHeader>

              <CardContent className="p-6">
                {/* ... rest of your existing code ... */}
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-sm text-pink-600 mt-8">
          © 2025 RosyDental. Platform untuk klinik gigi modern
        </p>
      </div>

      {/* ... rest of your existing dialog code ... */}
    </div>
  );
}

export default function SettingsAccountPage() {
  return (
    <AuthGuard requiredRole="PERAWAT">
      <SettingsAccountPageContent />
    </AuthGuard>
  );
}
