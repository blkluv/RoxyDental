"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddFinance from "@/components/ui/addfinance";
import AddProcedure from "@/components/ui/addprocedure";
import AddPacket from "@/components/ui/addpacket";
import DoctorNavbar from "@/components/ui/navbardr";


interface MedicalStaff {
  name: string;
  procedur: number;
  initialCommission: number;
  modalPrice: number;
  commission: string;
  pharmacy: number;
  modalPriceComm: number;
  avgCommission: string;
  packet: number;
  avgPacket: string;
  lab: number;
}


interface Procedure {
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  totalSale: number;
  avgComm: string;
  totalComm: number;
}

interface Packet {
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  totalSale: number;
  avgComm: string;
  totalComm: number;
}

interface FinanceData {
  tipe: string;
  nama: string;
  prosedur: string;
  potongan: number;
  bhpHarga: number;
  bhpKomisi: number;
  farmasiHarga: number;
  farmasiKomisi: number;
  paketHarga: number;
  paketKomisi: number;
  labHarga: number;
  labKomisi: number;
}

interface ProcedureData {
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  avgComm: string;
}

interface PacketData {
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  avgComm: string;
}

const PAGE_SIZE = 20;

export default function CommissionReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageMedical, setPageMedical] = useState(1);
  const [pageProcedure, setPageProcedure] = useState(1);
  const [pagePacket, setPagePacket] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"medical" | "procedure" | "packet">("medical");

  const [startDate, setStartDate] = useState("2025-09-29");
  const [endDate, setEndDate] = useState("2025-10-26");

  const [medicalStaff, setMedicalStaff] = useState<MedicalStaff[]>(
    Array.from({ length: 30 }, (_, i) => ({
      name: `Dr. Staff ${i + 1}`,
      procedur: (i + 1) * 1000000,
      initialCommission: (i + 1) * 100000,
      modalPrice: (i + 1) * 50000,
      commission: `${(20 + (i % 10)).toFixed(2)}%`,
      pharmacy: (i + 1) * 20000,
      modalPriceComm: (i + 1) * 10000,
      avgCommission: `${(15 + (i % 10)).toFixed(2)}%`,
      packet: (i + 1) * 50000,
      avgPacket: `${(10 + (i % 5)).toFixed(2)}%`,
      lab: (i + 1) * 10000,
    }))
  );

  const [procedures, setProcedures] = useState<Procedure[]>(
    Array.from({ length: 30 }, (_, i) => {
      const sale = 100000 + i * 5000;
      const qty = 1 + (i % 5);
      const avgCommVal = 10 + (i % 10);
      return {
        name: `Procedure ${i + 1}`,
        code: `P${(i + 1).toString().padStart(3, "0")}`,
        quantity: qty,
        salePrice: sale,
        totalSale: sale * qty,
        avgComm: `${avgCommVal.toFixed(2)}`,
        totalComm: Math.round((sale * qty * avgCommVal) / 100),
      };
    })
  );

  const [packets, setPackets] = useState<Packet[]>(
    Array.from({ length: 30 }, (_, i) => {
      const sale = 200000 + i * 10000;
      const qty = 1 + (i % 5);
      const avgCommVal = 10 + (i % 10);
      return {
        name: `Packet ${i + 1}`,
        sku: `PKT${(i + 1).toString().padStart(3, "0")}`,
        quantity: qty,
        salePrice: sale,
        totalSale: sale * qty,
        avgComm: `${avgCommVal.toFixed(2)}`,
        totalComm: Math.round((sale * qty * avgCommVal) / 100),
      };
    })
  );

  const [toast, setToast] = useState<{ show: boolean; msg: string; type?: "success" | "error" }>({
    show: false,
    msg: "",
  });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const filteredMedical = useMemo(
    () => medicalStaff.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, medicalStaff]
  );
  
  const filteredProcedure = useMemo(
    () => procedures.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, procedures]
  );
  
  const filteredPacket = useMemo(
    () => packets.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, packets]
  );

  const displayedMedical = filteredMedical.slice((pageMedical - 1) * PAGE_SIZE, pageMedical * PAGE_SIZE);
  const displayedProcedure = filteredProcedure.slice((pageProcedure - 1) * PAGE_SIZE, pageProcedure * PAGE_SIZE);
  const displayedPacket = filteredPacket.slice((pagePacket - 1) * PAGE_SIZE, pagePacket * PAGE_SIZE);

  const totalPagesMedical = Math.max(1, Math.ceil(filteredMedical.length / PAGE_SIZE));
  const totalPagesProcedure = Math.max(1, Math.ceil(filteredProcedure.length / PAGE_SIZE));
  const totalPagesPacket = Math.max(1, Math.ceil(filteredPacket.length / PAGE_SIZE));

  const totalMedical = filteredMedical.reduce(
    (acc, s) => {
      acc.procedur += s.procedur ?? 0;
      acc.initialCommission += s.initialCommission ?? 0;
      acc.modalPrice += s.modalPrice ?? 0;
      acc.pharmacy += s.pharmacy ?? 0;
      acc.modalPriceComm += s.modalPriceComm ?? 0;
      acc.packet += s.packet ?? 0;
      acc.lab += s.lab ?? 0;
      return acc;
    },
    { procedur: 0, initialCommission: 0, modalPrice: 0, pharmacy: 0, modalPriceComm: 0, packet: 0, lab: 0 }
  );

  const totalProcedure = filteredProcedure.reduce(
    (acc, p) => {
      acc.totalSale += p.totalSale ?? 0;
      acc.totalComm += p.totalComm ?? 0;
      return acc;
    },
    { totalSale: 0, totalComm: 0 }
  );

  const totalPacket = filteredPacket.reduce(
    (acc, p) => {
      acc.totalSale += p.totalSale ?? 0;
      acc.totalComm += p.totalComm ?? 0;
      return acc;
    },
    { totalSale: 0, totalComm: 0 }
  );

  const handleSaveFinance = (data: FinanceData) => {
    const newStaff: MedicalStaff = {
      name: data.nama,
      procedur: 0,
      initialCommission: data.potongan,
      modalPrice: data.bhpHarga,
      commission: `${data.bhpKomisi.toFixed(2)}%`,
      pharmacy: data.farmasiHarga,
      modalPriceComm: 0,
      avgCommission: `${data.farmasiKomisi.toFixed(2)}%`,
      packet: data.paketHarga,
      avgPacket: `${data.paketKomisi.toFixed(2)}%`,
      lab: data.labHarga,
    };

    setMedicalStaff((prev) => [...prev, newStaff]);
    setShowModal(false);
    showToast("Data keuangan berhasil ditambahkan!", "success");
  };

  const handleSaveProcedure = (data: ProcedureData) => {
    const qty = Number(data.quantity || 0);
    const sale = Number(data.salePrice || 0);
    const avg = parseFloat(data.avgComm || "0");
    const totalSale = qty * sale;
    const totalComm = Math.round((totalSale * avg) / 100);

    setProcedures((prev) => [
      ...prev,
      {
        name: data.name || `Procedure ${prev.length + 1}`,
        code: data.code || `P${(prev.length + 1).toString().padStart(3, "0")}`,
        quantity: qty,
        salePrice: sale,
        totalSale,
        avgComm: isNaN(avg) ? "0.00" : avg.toFixed(2),
        totalComm,
      },
    ]);

    setShowModal(false);
    showToast("Data prosedur berhasil ditambahkan!", "success");
  };

  const handleSavePacket = (data: PacketData) => {
    const qty = Number(data.quantity || 0);
    const sale = Number(data.salePrice || 0);
    const avg = parseFloat(data.avgComm || "0");
    const totalSale = qty * sale;
    const totalComm = Math.round((totalSale * avg) / 100);

    setPackets((prev) => [
      ...prev,
      {
        name: data.name || `Packet ${prev.length + 1}`,
        sku: data.sku || `PKT${(prev.length + 1).toString().padStart(3, "0")}`,
        quantity: qty,
        salePrice: sale,
        totalSale,
        avgComm: isNaN(avg) ? "0.00" : avg.toFixed(2),
        totalComm,
      },
    ]);

    setShowModal(false);
    showToast("Data paket berhasil ditambahkan!", "success");
  };

//jadipdf
const exportPDF = async () => {
  try {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF("landscape");

    // ================= Header =================
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(
      "LAPORAN KOMISI",
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Dicetak: ${new Date().toLocaleDateString("id-ID")}`,
      doc.internal.pageSize.getWidth() / 2,
      27,
      { align: "center" }
    );

    // ================= Table 1: Tenaga Medis =================
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("KOMISI TENAGA MEDIS", 14, 35);

    autoTable(doc, {
      startY: 38,
      head: [
        [
          "TENAGA MEDIS",
          "PROSEDUR",
          "POTONGAN AWAL",
          "HARGA MODAL (BHP)",
          "KOMISI",
          "FARMASI",
          "HARGA MODAL",
          "KOMISI",
          "PAKET",
          "KOMISI",
          "LAB",
        ],
      ],
      body: filteredMedical.map((s) => [
        s.name,
        s.procedur,
        `Rp ${s.initialCommission.toLocaleString("id-ID")}`,
        `Rp ${s.modalPrice.toLocaleString("id-ID")}`,
        s.commission,
        `Rp ${s.pharmacy.toLocaleString("id-ID")}`,
        `Rp ${s.modalPriceComm.toLocaleString("id-ID")}`,
        s.avgCommission,
        `Rp ${s.packet.toLocaleString("id-ID")}`,
        s.avgPacket,
        `Rp ${s.lab.toLocaleString("id-ID")}`,
      ]),
      foot: [
        [
          "TOTAL",
          "-",
          `Rp ${totalMedical.initialCommission.toLocaleString("id-ID")}`,
          `Rp ${totalMedical.modalPrice.toLocaleString("id-ID")}`,
          "-",
          `Rp ${totalMedical.pharmacy.toLocaleString("id-ID")}`,
          `Rp ${totalMedical.modalPriceComm.toLocaleString("id-ID")}`,
          "-",
          `Rp ${totalMedical.packet.toLocaleString("id-ID")}`,
          "-",
          `Rp ${totalMedical.lab.toLocaleString("id-ID")}`,
        ],
      ],
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 231, 243] },
    });

    // ================= Table 2: Prosedur / Layanan =================
    doc.addPage();
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("KOMISI PROSEDUR / LAYANAN", 14, 15);

    autoTable(doc, {
      startY: 18,
      head: [
        ["PROSEDUR", "KODE", "QTY", "HARGA JUAL", "TOTAL PENJUALAN", "KOMISI (%)", "TOTAL KOMISI"],
      ],
      body: filteredProcedure.map((p) => [
        p.name,
        p.code,
        p.quantity,
        `Rp ${p.salePrice.toLocaleString("id-ID")}`,
        `Rp ${p.totalSale.toLocaleString("id-ID")}`,
        `${p.avgComm}%`,
        `Rp ${p.totalComm.toLocaleString("id-ID")}`,
      ]),
      foot: [
        [
          "TOTAL",
          "-",
          "-",
          "-",
          `Rp ${totalProcedure.totalSale.toLocaleString("id-ID")}`,
          "-",
          `Rp ${totalProcedure.totalComm.toLocaleString("id-ID")}`,
        ],
      ],
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 231, 243] },
    });

    // ================= Table 3: Paket =================
    doc.addPage();
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("KOMISI PAKET", 14, 15);

    autoTable(doc, {
      startY: 18,
      head: [["PAKET", "SKU", "QTY", "HARGA JUAL", "TOTAL PENJUALAN", "KOMISI (%)", "TOTAL KOMISI"]],
      body: filteredPacket.map((p) => [
        p.name,
        p.sku,
        p.quantity,
        `Rp ${p.salePrice.toLocaleString("id-ID")}`,
        `Rp ${p.totalSale.toLocaleString("id-ID")}`,
        `${p.avgComm}%`,
        `Rp ${p.totalComm.toLocaleString("id-ID")}`,
      ]),
      foot: [
        [
          "TOTAL",
          "-",
          "-",
          "-",
          `Rp ${totalPacket.totalSale.toLocaleString("id-ID")}`,
          "-",
          `Rp ${totalPacket.totalComm.toLocaleString("id-ID")}`,
        ],
      ],
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 231, 243] },
    });

    doc.save(`Laporan_Komisi_${startDate}_${endDate}.pdf`);
    showToast("PDF berhasil diunduh!", "success");
  } catch (error) {
    showToast("Gagal mengunduh PDF", "error");
    console.error(error);
  }
};

  const exportXLSX = async () => {
    try {
      const XLSX = await import("xlsx");
      
      const wb = XLSX.utils.book_new();

      // Sheet 1: Medical Staff
      const wsMedical = XLSX.utils.aoa_to_sheet([
        ["LAPORAN KOMISI TENAGA MEDIS"],
        [],
        ["TENAGA MEDIS", "PROSEDUR", "POTONGAN AWAL", "HARGA MODAL (BHP)", "KOMISI", "FARMASI", "HARGA MODAL", "KOMISI", "PAKET", "KOMISI", "LAB"],
        ...filteredMedical.map(s => [
          s.name,
          s.procedur,
          s.initialCommission,
          s.modalPrice,
          s.commission,
          s.pharmacy,
          s.modalPriceComm,
          s.avgCommission,
          s.packet,
          s.avgPacket,
          s.lab
        ]),
        ["TOTAL", totalMedical.procedur, totalMedical.initialCommission, totalMedical.modalPrice, "-", totalMedical.pharmacy, totalMedical.modalPriceComm, "-", totalMedical.packet, "-", totalMedical.lab]
      ]);
      
      // Styling for medical sheet
      wsMedical["!cols"] = [
        { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, 
        { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(wb, wsMedical, "Komisi Tenaga Medis");

      // Sheet 2: Procedures
      const wsProcedure = XLSX.utils.aoa_to_sheet([
        ["LAPORAN KOMISI PROSEDUR / LAYANAN"],
        [`Periode: ${startDate} s/d ${endDate}`],
        [],
        ["PROSEDUR", "KODE", "KUANTITAS", "HARGA JUAL", "TOTAL PENJUALAN", "KOMISI (%)", "TOTAL KOMISI"],
        ...filteredProcedure.map(p => [
          p.name,
          p.code,
          p.quantity,
          p.salePrice,
          p.totalSale,
          `${p.avgComm}%`,
          p.totalComm
        ]),
        ["TOTAL", "-", "-", "-", totalProcedure.totalSale, "-", totalProcedure.totalComm]
      ]);
      
      wsProcedure["!cols"] = [
        { wch: 25 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(wb, wsProcedure, "Komisi Prosedur");

      // Sheet 3: Packets
      const wsPacket = XLSX.utils.aoa_to_sheet([
        ["LAPORAN KOMISI PAKET"],
        [`Periode: ${startDate} s/d ${endDate}`],
        [],
        ["PAKET", "SKU", "KUANTITAS", "HARGA JUAL", "TOTAL PENJUALAN", "KOMISI (%)", "TOTAL KOMISI"],
        ...filteredPacket.map(p => [
          p.name,
          p.sku,
          p.quantity,
          p.salePrice,
          p.totalSale,
          `${p.avgComm}%`,
          p.totalComm
        ]),
        ["TOTAL", "-", "-", "-", totalPacket.totalSale, "-", totalPacket.totalComm]
      ]);
      
      wsPacket["!cols"] = [
        { wch: 25 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(wb, wsPacket, "Komisi Paket");

      XLSX.writeFile(wb, `Laporan_Komisi_${startDate}_${endDate}.xlsx`);
      showToast("Excel berhasil diunduh!", "success");
    } catch (error) {
      showToast("Gagal mengunduh Excel", "error");
      console.error(error);
    }
  };

  const renderPagination = (page: number, setPage: (val: number) => void, totalPages: number) => (
    <div className="flex justify-end gap-3 items-center py-2">
      <button
        className={`cursor-pointer text-pink-600 text-base font-bold px-2 ${page === 1 ? "opacity-40 pointer-events-none" : ""}`}
        onClick={() => setPage(Math.max(1, page - 1))}
        aria-label="previous page"
      >
        ←
      </button>
      <span className="text-xs text-pink-600">Page {page} of {totalPages}</span>
      <button
        className={`cursor-pointer text-pink-600 text-base font-bold px-2 ${page === totalPages ? "opacity-40 pointer-events-none" : ""}`}
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        aria-label="next page"
      >
        →
      </button>
    </div>
  );

  const formatCurrency = (v: number) => `Rp. ${v.toLocaleString("id-ID")}`;

  return (
  <div className="min-h-screen w-full bg-[#FFE6EE]">
    <DoctorNavbar />

    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Filter */}
        <Card className="shadow-md mb-6">
          <CardContent className="p-4 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[250px] mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <Input
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-pink-300"
              />
            </div>

            <div className="flex gap-2 ml-auto mt-6">
              <Button 
                variant="outline" 
                className="border-pink-300 text-pink-700 text-xs px-3 py-2 hover:bg-pink-50 flex items-center gap-1"
                onClick={exportPDF}
              >
                <Download className="w-3 h-3" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                className="border-pink-300 text-pink-700 text-xs px-3 py-2 hover:bg-pink-50 flex items-center gap-1"
                onClick={exportXLSX}
              >
                <Download className="w-3 h-3" />
                XLSX
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medical */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <h2 className="text-xl font-bold text-pink-600">KOMISI TENAGA MEDIS</h2>
          <button 
            onClick={() => { setModalMode("medical"); setShowModal(true); }} 
            className="bg-pink-600 text-white text-xs px-3 py-2 rounded hover:bg-pink-700"
          >
            + Tambah Laporan
          </button>
        </div>

        <Card className="shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {["TENAGA MEDIS","PROSEDUR","POTONGAN AWAL","HARGA MODAL (BHP)","KOMISI (AVG)","FARMASI","HARGA MODAL","KOMISI (AVG)","PAKET","KOMISI (AVG)","LAB"].map(
                    col => <th key={col} className="px-3 py-2 text-left font-semibold text-pink-900 whitespace-nowrap">{col}</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {displayedMedical.map((s, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-3 py-2 whitespace-nowrap">{s.name}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.procedur)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.initialCommission)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.modalPrice)}</td>
                    <td className="px-3 py-2 text-right">{s.commission}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.pharmacy)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.modalPriceComm)}</td>
                    <td className="px-3 py-2 text-right">{s.avgCommission}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.packet)}</td>
                    <td className="px-3 py-2 text-right">{s.avgPacket}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(s.lab)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.procedur)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.initialCommission)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.modalPrice)}</td>
                  <td className="px-3 py-2 text-right">-</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.pharmacy)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.modalPriceComm)}</td>
                  <td className="px-3 py-2 text-right">-</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.packet)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalMedical.lab)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination Medical */}
          <div className="px-4 py-2">
            {renderPagination(pageMedical, setPageMedical, totalPagesMedical)}
          </div>
        </Card>

        {/* Procedures */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <h2 className="text-xl font-bold text-pink-600">KOMISI PROSEDUR / LAYANAN</h2>
          <button 
            onClick={() => { setModalMode("procedure"); setShowModal(true); }} 
            className="bg-pink-600 text-white text-xs px-3 py-2 rounded hover:bg-pink-700"
          >
            + Tambah Prosedur
          </button>
        </div>

        <Card className="shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {["PROSEDUR","KODE","QTY","HARGA JUAL","TOTAL PENJUALAN","KOMISI (%)","TOTAL KOMISI"].map(
                    col => <th key={col} className="px-3 py-2 text-left font-semibold text-pink-900 whitespace-nowrap">{col}</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {displayedProcedure.map((p, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-3 py-2 whitespace-nowrap">{p.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{p.code}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{p.quantity}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(p.salePrice)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(p.totalSale)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{p.avgComm}%</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(p.totalComm)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalProcedure.totalSale)}</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalProcedure.totalComm)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination Procedure */}
          <div className="px-4 py-2">
            {renderPagination(pageProcedure, setPageProcedure, totalPagesProcedure)}
          </div>
        </Card>

        {/* Packets */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <h2 className="text-xl font-bold text-pink-600">KOMISI PAKET</h2>
          <button 
            onClick={() => { setModalMode("packet"); setShowModal(true); }} 
            className="bg-pink-600 text-white text-xs px-3 py-2 rounded hover:bg-pink-700"
          >
            + Tambah Paket
          </button>
        </div>

        <Card className="shadow-md overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {["PAKET","SKU","QTY","HARGA JUAL","TOTAL PENJUALAN","KOMISI (%)","TOTAL KOMISI"].map(
                    col => <th key={col} className="px-3 py-2 text-left font-semibold text-pink-900 whitespace-nowrap">{col}</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {displayedPacket.map((p, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-3 py-2 whitespace-nowrap">{p.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{p.sku}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{p.quantity}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(p.salePrice)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(p.totalSale)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{p.avgComm}%</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(p.totalComm)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalPacket.totalSale)}</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">{formatCurrency(totalPacket.totalComm)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination Packet */}
          <div className="px-4 py-2">
            {renderPagination(pagePacket, setPagePacket, totalPagesPacket)}
          </div>
        </Card>
      </div>

      {/* Modal - Add Finance / Procedure / Packet */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <div className="rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-pink-700">
            {modalMode === "medical"
            ? "Tambah Laporan Keuangan"
            : modalMode === "procedure"
            ? "Tambah Prosedur"
            : "Tambah Paket"}
            </h3>
            <button
            onClick={() => setShowModal(false)}
            className="text-pink-600 text-xs px-2 py-1 hover:bg-pink-50 rounded"
            >
            Close
            </button>
            </div>


            <div className="p-1">
                {modalMode === "medical" && (
                  <AddFinance
                    onClose={() => setShowModal(false)}
                    handleSave={handleSaveFinance}
                  />
                )}

                {modalMode === "procedure" && (
                  <AddProcedure
                    onClose={() => setShowModal(false)}
                    handleSave={handleSaveProcedure}
                  />
                )}

                {modalMode === "packet" && (
                  <AddPacket
                    onClose={() => setShowModal(false)}
                    handleSave={handleSavePacket}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="fixed right-4 bottom-4 z-50">
        {toast.show && (
          <div
            role="status"
            aria-live="polite"
            className={`min-w-[220px] max-w-sm px-4 py-3 rounded shadow-md text-sm font-medium ${
              toast.type === "error" ? "bg-red-100 text-red-800" : "bg-white border border-pink-200 text-pink-700"
            }`}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
