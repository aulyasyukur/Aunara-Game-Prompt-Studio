/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';

export function downloadAunaraGuidePdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const maxWidth = pageWidth - marginX * 2;
  let y = 20;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const addSectionTitle = (num: string, title: string) => {
    ensureSpace(16);
    y += 3;
    doc.setFillColor(247, 242, 233);
    doc.roundedRect(marginX, y - 5, maxWidth, 10, 2, 2, 'F');
    doc.setFillColor(233, 143, 123);
    doc.rect(marginX, y - 5, 3, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(52, 78, 91);
    doc.text(`${num}. ${title}`, marginX + 6, y + 1.5);
    y += 10;
  };

  const addParagraph = (text: string, indent = 0) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.8);
    doc.setTextColor(55, 71, 79);
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    ensureSpace(lines.length * 4.8 + 2);
    doc.text(lines, marginX + indent, y);
    y += lines.length * 4.8 + 2.2;
  };

  const addBullet = (lead: string, detail: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.6);
    doc.setTextColor(52, 78, 91);
    const fullText = `- ${lead}: ${detail}`;
    const lines = doc.splitTextToSize(fullText, maxWidth - 4);
    ensureSpace(lines.length * 4.6 + 2);

    // Render first line with bold lead cleanly via split
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 71, 79);
    doc.text(lines, marginX + 3, y);
    y += lines.length * 4.6 + 1.8;
  };

  // === COVER / TOP HEADER BANNER ===
  doc.setFillColor(52, 78, 91);
  doc.roundedRect(marginX, 14, maxWidth, 34, 4, 4, 'F');

  doc.setFillColor(233, 143, 123);
  doc.circle(marginX + maxWidth - 14, 24, 6, 'F');
  doc.setFillColor(108, 170, 164);
  doc.circle(marginX + maxWidth - 22, 34, 4.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 253, 248);
  doc.text('AUNARA', marginX + 7, 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(233, 143, 123);
  doc.text('CREATE  •  PLAY  •  LEARN', marginX + 7, 31.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(225, 235, 238);
  doc.text('Buku Panduan Lengkap Merancang & Memainkan Game Edukasi AI', marginX + 7, 39.5);

  y = 56;
  addParagraph(
    'Panduan ini disusun agar guru, orang tua, dan kreator konten dapat merancang prompt game edukasi berkualitas tinggi di AUNARA, membangunnya melalui Google Gemini, serta langsung memainkannya di kelas maupun di rumah.'
  );

  // === BAGIAN 1 ===
  addSectionTitle('1', 'Alur Kerja Cepat (5 Langkah dari Ide ke Game Siap Main)');
  addBullet('Langkah 1 - Pilih Jalur Mulai', 'Gunakan menu "Buat Game" untuk merancang dari awal, atau pilih 1 dari 65+ kurikulum siap pakai di menu "Template Game".');
  addBullet('Langkah 2 - Lengkapi 7 Langkah Smart Game Creator', 'Tentukan Jenjang (PAUD-SMA), Mata Pelajaran, Materi, Genre & Mekanisme, Tema & Karakter, serta Pengaturan Level (5-50 level).');
  addBullet('Langkah 3 - Generate Master Prompt', 'Klik "Generate Master Prompt". AUNARA menyusun instruksi terstruktur 30 seksi yang diawali perintah alami "Buatkan game edukasi interaktif...".');
  addBullet('Langkah 4 - Uji Live atau Jalankan di Google Gemini', 'Gunakan tab "Uji Live di Gemini AI" langsung di dalam AUNARA untuk melihat hasil game secara instan, atau salin prompt dan tempelkan ke gemini.google.com/app.');
  addBullet('Langkah 5 - Mainkan Layar Penuh & Unduh (.html)', 'Mainkan game hasil uji secara langsung dalam mode Layar Penuh (Fullscreen) atau unduh sebagai file .html untuk diputar offline di kelas.');

  // === BAGIAN 2 ===
  addSectionTitle('2', 'Penjelasan Menu Utama AUNARA Studio');
  addBullet('Dashboard', 'Ringkasan aktivitas studio, jumlah prompt tersimpan, template tersedia, karakter, dan pintasan cepat ke fitur utama.');
  addBullet('Buat Game', 'Wizard 7 langkah interaktif untuk menyusun rancangan pedagogis game tanpa perlu keahlian pemrograman.');
  addBullet('Template Game', 'Koleksi 65+ templat terkurasi untuk jenjang PAUD, TK, SD, SMP, dan SMA lintas mata pelajaran.');
  addBullet('Prompt Saya', 'Arsip riwayat seluruh Master Prompt yang pernah Anda buat; mendukung buka ulang, duplikasi, edit, dan unduh TXT.');
  addBullet('Karakter Saya', 'Studio untuk membuat maskot pembelajaran kustom (atau mengunggah gambar karakter) agar konsisten di seluruh level game.');

  // === BAGIAN 3 ===
  addSectionTitle('3', 'Rekomendasi Pengaturan Pedagogi per Jenjang');
  addBullet('PAUD (2-4 Tahun)', 'Gunakan 5 Level, Nyawa Tak Terbatas (0), mekanisme Sentuh/Cocokkan Warna & Bentuk, teks sangat singkat, visual ceria berukuran besar.');
  addBullet('TK (4-6 Tahun)', 'Gunakan 5-10 Level, Nyawa 5 atau Tak Terbatas, mekanisme Drag & Drop / Matching Pairs, fokus literasi huruf & numerasi awal.');
  addBullet('SD (Kelas 1-6)', 'Gunakan 10-20 Level, Nyawa 3, kombinasi Pilihan Ganda + Urutkan Langkah + Boss Battle tiap 5 level, skor & bintang 1-3.');
  addBullet('SMP (Kelas 7-9)', 'Gunakan 10-30 Level, genre Educational RPG / Science Adventure / Escape Room, soal aplikasi & analisis studi kasus.');
  addBullet('SMA (Kelas 10-12)', 'Gunakan 15-40 Level, genre Simulation / Strategy / Logic Game, fokus HOTS (C4-C6), evaluasi argumen, dan laporan kompetensi.');

  // === BAGIAN 4 ===
  addSectionTitle('4', 'Penerapan Taksonomi Bloom pada Progresi Level');
  addParagraph(
    'AUNARA secara otomatis memetakan jumlah level pilihan Anda ke dalam beberapa Babak Dunia (Chapters) dengan tingkat kesulitan bertahap:'
  );
  addBullet('Babak Awal (C1 - Mengingat)', 'Tutorial interaktif, pengenalan tombol, simbol, dan definisi dasar dengan tingkat kesulitan ramah.');
  addBullet('Babak Eksplorasi (C2 - Memahami)', 'Klasifikasi konsep, perbandingan benar/salah, dan pemahaman hubungan sebab-akibat.');
  addBullet('Babak Aplikasi (C3 - Menerapkan)', 'Pemecahan masalah kontekstual sehari-hari, simulasi eksperimen, atau hitungan bertahap.');
  addBullet('Babak Lanjut & Boss Battle (C4-C6 - HOTS)', 'Analisis kasus terpadu, evaluasi strategi, Boss Battle dengan HP Bar, dan Layar Laporan Hasil Belajar.');

  // === BAGIAN 5 ===
  addSectionTitle('5', 'Cara Menjalankan Prompt di Google Gemini & Gemini Canvas');
  addBullet('1. Salin Utuh Tanpa Dipotong', 'Klik tombol "Salin Prompt" di halaman hasil. Jangan menghapus bagian tengah agar semua aturan level, audio, dan validasi tetap lengkap.');
  addBullet('2. Buka Google Gemini', 'Kunjungi https://gemini.google.com/app lalu tempelkan (Ctrl+V / Cmd+V) prompt yang diawali "Buatkan game edukasi interaktif..." dan tekan Enter.');
  addBullet('3. Aktifkan Mode Canvas (Jika Tersedia)', 'Pada Gemini Web, aktifkan fitur Canvas agar game langsung tampil di panel pratinjau interaktif yang bisa dimainkan seketika.');
  addBullet('4. Jika Respons Berhenti di Tengah', 'Ketik perintah lanjutan: "Lanjutkan pembuatan game persis dari bagian terakhir hingga seluruh level dan layar kemenangan selesai utuh."');
  addBullet('5. Simpan untuk Diputar Offline', 'Unduh hasil game sebagai file .html dari tab "Uji Live di Gemini AI" agar bisa diputar ulang kapan saja di kelas tanpa internet.');

  // === BAGIAN 6 ===
  addSectionTitle('6', 'Pemecahan Masalah (Troubleshooting) Cepat');
  addBullet('Soal Terlalu Sulit/Mudah', 'Klik "Edit Prompt" atau kembali ke Smart Game Creator, perjelas bagian "Pengetahuan Awal Pemain" dan pilih Kurva Kesulitan "Gentle Adaptive".');
  addBullet('Tampilan Kurang Lega Saat Main', 'Klik tombol "Layar Penuh" di sudut kanan atas Pratinjau Game (tekan tombol ESC di keyboard untuk keluar dari mode layar penuh).');
  addBullet('Suara Game Tidak Terdengar', 'Klik tombol "Mulai" di dalam game terlebih dahulu karena peramban mewajibkan interaksi klik pertama sebelum mengaktifkan Web Audio API.');
  addBullet('Ingin Memakai Game di Laptop Sekolah Tanpa Internet', 'Klik tombol "Unduh Game (.html)" dari tab "Uji Live di Gemini AI", lalu buka file .html tersebut langsung di Chrome/Edge.');

  // === FOOTER & PAGE NUMBERS ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(215, 222, 225);
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(115, 130, 138);
    doc.text('AUNARA — AI Educational Game Prompt Studio (Create • Play • Learn)', marginX, pageHeight - 8);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: 'right' });
  }

  doc.save('Panduan_Lengkap_AUNARA_Studio.pdf');
}
