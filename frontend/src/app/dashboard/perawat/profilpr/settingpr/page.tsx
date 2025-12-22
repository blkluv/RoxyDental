"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Lock, Bell, CreditCard, ExternalLink, FileText, Scale, Mail, LogOut } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import SettingsSidebar from "@/components/ui/SettingsSidebarpr";

export default function SettingsAbout() {
  const [activeMenu, setActiveMenu] = useState("tentang");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const aboutInfo = {
    appName: "Sistem Manajemen Rumah Sakit",
    version: "Gold",
    build: "3876-SK-25",
    releaseDate: "29 Oktober 2025",
    edition: "Enterprise",
  };

  const documents = [
    { name: "Pusat Bantuan", icon: FileText },
    { name: "Diskomentar API", icon: FileText },
    { name: "Laporkan Bug", icon: FileText },
    { name: "Hubungi Support", icon: Mail },
  ];

  const legal = [
    { name: "Syarat & Ketentuan", icon: Scale },
    { name: "Kebijakan Privasi", icon: Scale },
    { name: "Lisensi Open Source", icon: FileText },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Add your actual logout logic here
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLogoutDialogOpen(false);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SettingsSidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            onLogout={() => setLogoutDialogOpen(true)}
          />

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Info Aplikasi */}
            <Card className="shadow-md rounded-lg">
              <CardHeader className="bg-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-bold text-pink-900">Informasi Aplikasi</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {Object.entries(aboutInfo).map(([key, value], idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-pink-700 font-medium">
                      {key === "appName" ? "Nama Aplikasi:" : key.charAt(0).toUpperCase() + key.slice(1) + ":"}
                    </span>
                    <span className="text-pink-900 font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dokumen & Bantuan */}
            <Card className="shadow-md rounded-lg">
              <CardHeader className="bg-white px-6 py-4 rounded-t-lg">
                <h2 className="text-lg font-bold text-pink-900">Dokumen & Bantuan</h2>
                <p className="text-sm text-pink-600 mt-1">Dapatkan bantuan dan dokumentasi</p>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {documents.map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-pink-50 rounded-lg border border-gray-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-pink-600" />
                        <span className="text-pink-900 font-medium">{doc.name}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-pink-400" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Legal */}
            <Card className="shadow-md rounded-lg">
              <CardHeader className="bg-white px-6 py-4 rounded-t-lg">
                <h2 className="text-lg font-bold text-pink-900">Legal</h2>
                <p className="text-sm text-pink-600 mt-1">Informasi hukum dan kebijakan</p>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {legal.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-pink-50 rounded-lg border border-gray-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-pink-600" />
                        <span className="text-pink-900 font-medium">{item.name}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-pink-400" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Pernyataan */}
            <Card className="shadow-md rounded-lg bg-pink-600 text-white">
              <CardContent className="p-6 text-center space-y-2">
                <CardTitle className="text-lg font-bold">Pernyataan</CardTitle>
                <CardDescription className="font-bold text-xl leading-relaxed">
                  Terima kasih telah menggunakan aplikasi kami!
                </CardDescription>
                <CardDescription className="text-sm leading-relaxed">
                  Sistem Manajemen Rumah Sakit dirancang untuk membantu tenaga medis memberikan pelayanan terbaik kepada pasien.
                </CardDescription>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full">
              <LogOut className="w-6 h-6 text-pink-600" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-pink-900">
              Konfirmasi Keluar
            </DialogTitle>
            <DialogDescription className="text-center text-pink-700 mt-2">
              Apakah Anda yakin ingin keluar dari akun ini?
              <br />
              Anda akan dialihkan ke halaman login.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="flex-1 border-pink-300 text-pink-700 hover:bg-pink-50"
              disabled={isLoggingOut}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Ya, Keluar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
