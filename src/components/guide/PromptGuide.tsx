/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Gamepad2,
  Layers,
  Sparkles,
  HelpCircle,
  Sliders,
  PlayCircle
} from 'lucide-react';
import { downloadAunaraGuidePdf } from '../../services/pdfGuide';

const QUICK_STEPS = [
  {
    step: '01',
    title: 'Pilih Jalur Pembuatan',
    desc: 'Mulai dari nol melalui menu Buat Game (7 langkah terpandu), atau percepat dengan memilih salah satu dari 65+ kurikulum siap pakai di menu Template Game.'
  },
  {
    step: '02',
    title: 'Sesuaikan Jenjang & Materi',
    desc: 'Pilih jenjang (PAUD, TK, SD, SMP, SMA, atau Custom), mata pelajaran, topik, tujuan pembelajaran, serta kompetensi yang ingin dicapai siswa.'
  },
  {
    step: '03',
    title: 'Atur Mekanisme, Karakter & Level',
    desc: 'Kombinasikan 2–3 mekanisme interaktif (Pilihan Ganda, Drag & Drop, Matching Pairs, Puzzle), pilih atau unggah maskot karakter, dan tentukan jumlah level (5–50 level).'
  },
  {
    step: '04',
    title: 'Generate & Uji di Gemini AI',
    desc: 'Klik Generate Master Prompt. Anda dapat langsung menguji dan memainkannya di tab Uji Live di Gemini AI, atau menyalin prompt ke gemini.google.com/app.'
  },
  {
    step: '05',
    title: 'Mainkan Layar Penuh & Unduh (.html)',
    desc: 'Mainkan hasil uji langsung dalam mode Layar Penuh (Fullscreen) atau unduh sebagai file .html agar bisa diputar ulang offline di laptop kelas.'
  }
];

const GRADE_MATRIX = [
  {
    level: 'PAUD (2–4 Thn)',
    levels: '5 Level',
    lives: 'Tak Terbatas (0)',
    mechanics: 'Sentuh Objek, Klasifikasi Warna/Bentuk, Cerita Interaktif',
    tips: 'Gunakan kalimat 3–5 kata, tombol sangat besar, dan tanpa hukuman skor minus.'
  },
  {
    level: 'TK (4–6 Thn)',
    levels: '5–10 Level',
    lives: '5 atau Tak Terbatas',
    mechanics: 'Matching Pairs, Drag & Drop, Puzzle Sederhana',
    tips: 'Fokus pengenalan huruf, suku kata, angka 1–20, dan pembiasaan positif.'
  },
  {
    level: 'SD (Kelas 1–6)',
    levels: '10–20 Level',
    lives: '3 Nyawa',
    mechanics: 'Pilihan Ganda, Urutkan Langkah, Boss Battle tiap 5 level',
    tips: 'Padukan alur cerita petualangan dengan sistem bintang 1–3 dan kombo skor.'
  },
  {
    level: 'SMP (Kelas 7–9)',
    levels: '10–30 Level',
    lives: '3 Nyawa',
    mechanics: 'Science Adventure, Escape Room, Simulasi & Analisis Kasus',
    tips: 'Dorong pemahaman sebab-akibat, eksperimen virtual, dan penjelasan ilmiah singkat.'
  },
  {
    level: 'SMA (Kelas 10–12)',
    levels: '15–40 Level',
    lives: '3 Nyawa',
    mechanics: 'Strategy Game, Logic Challenge, Simulasi HOTS (C4–C6)',
    tips: 'Sertakan studi kasus kontekstual, evaluasi data, dan kartu laporan penguasaan materi.'
  }
];

const FAQ_ITEMS = [
  {
    q: 'Mengapa hasil prompt AUNARA diawali dengan kalimat "Buatkan game..." bukan perintah teknis kode?',
    a: 'Perintah alami "Buatkan game edukasi interaktif..." membuat Google Gemini dan fitur Gemini Canvas langsung memahami bahwa Anda ingin dibuatkan permainan utuh yang bisa langsung dimainkan, bukan sekadar potongan skrip mentah atau penjelasan teori.'
  },
  {
    q: 'Bagaimana jika Gemini berhenti di tengah pembuatan saat saya memilih 30–50 level?',
    a: 'Cukup balas di kolom chat Gemini dengan kalimat: "Lanjutkan pembuatan game persis dari bagian terakhir hingga seluruh level dan layar laporan kemenangan selesai utuh." Anda juga disarankan mencoba 10–15 level terlebih dahulu untuk hasil tercepat.'
  },
  {
    q: 'Bagaimana cara menyimpan game hasil Gemini agar bisa dimainkan berulang kali di kelas?',
    a: 'Saat menjalankan uji coba melalui tab "Uji Live di Gemini AI", cukup klik tombol "Unduh Game (.html)" untuk menyimpan game sebagai satu file utuh. File tersebut dapat langsung dibuka di browser Chrome/Edge kapan saja bahkan tanpa koneksi internet.'
  },
  {
    q: 'Mengapa suara efek game tidak langsung berbunyi saat layar pertama terbuka?',
    a: 'Browser modern menerapkan kebijakan keamanan autoplay audio. Klik tombol "Mulai Petualangan" di dalam game terlebih dahulu — setelah klik pertama, seluruh efek suara Web Audio API akan aktif otomatis.'
  },
  {
    q: 'Bagaimana cara memperbesar tampilan game agar penuh satu layar proyektor kelas?',
    a: 'Klik tombol "Layar Penuh" pada bilah atas pratinjau game di tab Uji Live di Gemini AI. Tekan tombol ESC di keyboard kapan saja untuk kembali ke tampilan normal.'
  }
];

export const PromptGuide: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [downloadedNotice, setDownloadedNotice] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    downloadAunaraGuidePdf();
    setDownloadedNotice(true);
    setTimeout(() => setDownloadedNotice(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Hero Header + Primary PDF Download CTA */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6CAAA4]">
              <BookOpen className="w-4 h-4" />
              <span>Buku Panduan Pengguna AUNARA</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#344E5B] dark:text-[#F7F2E9]">
              Panduan Lengkap Merancang & Memainkan Game Edukasi
            </h2>
            <p className="text-xs sm:text-sm text-[#344E5B]/75 dark:text-[#A9BCA6] max-w-2xl leading-relaxed">
              Ikuti langkah praktis berikut untuk mengubah materi pelajaran menjadi game interaktif siap main — mulai dari mengisi wizard, menjalankan di Google Gemini, hingga memainkannya di kelas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] shadow-sm transition-all active:scale-[0.98]"
            >
              {downloadedNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PDF Panduan Diunduh!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Panduan (PDF)</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6] text-center md:text-right">
              Format A4 siap cetak & bagikan ke rekan guru
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: 5-Step Quick Start */}
      <section className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E98F7B]/15 text-[#E98F7B] flex items-center justify-center">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
              1. Alur Cepat: 5 Langkah dari Ide ke Game Siap Main
            </h3>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Cocok untuk pengguna baru — tidak membutuhkan latar belakang pemrograman.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {QUICK_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/8 dark:border-white/10 flex flex-col gap-1.5"
            >
              <span className="text-xs font-black font-mono text-[#E98F7B]">{item.step}</span>
              <h4 className="text-xs font-extrabold text-[#344E5B] dark:text-[#F7F2E9] leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Mengenal Fitur & Menu Studio */}
      <section className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6CAAA4]/20 text-[#6CAAA4] flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
              2. Fungsi Setiap Menu di AUNARA Studio
            </h3>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Kenali peran setiap menu agar alur kerja Anda semakin efisien.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
            <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-1">Buat Game (Smart Creator)</strong>
            <p className="text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
              Wizard 7 langkah untuk menyusun Master Prompt game secara detail. Anda bisa maju-mundur antar langkah tanpa kehilangan isian.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
            <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-1">Dashboard Studio</strong>
            <p className="text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
              Pusat ringkasan jumlah prompt tersimpan, template tersedia, karakter studio, riwayat kreasi terakhir, serta pintasan cepat ke fitur utama.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
            <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-1">Template Game (65+ Kurikulum)</strong>
            <p className="text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
              Perpustakaan ide siap pakai lintas jenjang PAUD–SMA. Klik "Gunakan" untuk mengisi seluruh wizard secara otomatis dalam satu klik.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
            <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-1">Prompt Saya</strong>
            <p className="text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
              Menyimpan riwayat seluruh Master Prompt yang pernah Anda hasilkan, lengkap dengan tombol duplikasi, edit ulang, dan unduh TXT.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
            <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-1">Karakter Saya</strong>
            <p className="text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
              Rancang maskot khusus kelas atau unggah ilustrasi karakter sendiri agar identitas visual tokoh tetap konsisten di semua level game.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
            <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-1">Uji Live di Gemini AI</strong>
            <p className="text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed">
              Tersedia pada halaman hasil prompt untuk langsung menguji prompt ke Gemini, mengecek 9 kriteria audit kualitas, dan langsung memainkan hasilnya.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Rekomendasi Pengaturan per Jenjang (Table) */}
      <section className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#A9BCA6]/30 text-[#344E5B] dark:text-[#A9BCA6] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
              3. Rekomendasi Pengaturan Pedagogi per Jenjang
            </h3>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Gunakan tabel acuan ini agar tingkat kesulitan dan mekanisme sesuai tahap perkembangan usia anak.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#344E5B]/10 dark:border-white/10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] border-b border-[#344E5B]/10 dark:border-white/10">
                <th className="py-3 px-4 font-extrabold">Jenjang</th>
                <th className="py-3 px-4 font-extrabold">Jumlah Level</th>
                <th className="py-3 px-4 font-extrabold">Nyawa</th>
                <th className="py-3 px-4 font-extrabold">Mekanisme Ideal</th>
                <th className="py-3 px-4 font-extrabold">Tips Desain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#344E5B]/10 dark:divide-white/10">
              {GRADE_MATRIX.map((row) => (
                <tr key={row.level} className="hover:bg-[#F7F2E9]/40 dark:hover:bg-white/5">
                  <td className="py-3 px-4 font-bold text-[#E98F7B] whitespace-nowrap">{row.level}</td>
                  <td className="py-3 px-4 font-semibold text-[#344E5B] dark:text-[#F7F2E9] whitespace-nowrap">{row.levels}</td>
                  <td className="py-3 px-4 text-[#344E5B]/80 dark:text-[#D5E2E6] whitespace-nowrap">{row.lives}</td>
                  <td className="py-3 px-4 text-[#344E5B]/80 dark:text-[#D5E2E6]">{row.mechanics}</td>
                  <td className="py-3 px-4 text-[#344E5B]/75 dark:text-[#A9BCA6]">{row.tips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Cara Menjalankan di Google Gemini & Gemini Canvas */}
      <section className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E98F7B]/15 text-[#E98F7B] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
              4. Cara Menjalankan Hasil Prompt di Google Gemini & Gemini Canvas
            </h3>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Prompt AUNARA disusun secara alami ("Buatkan game edukasi interaktif...") agar langsung dipahami Gemini.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-[#344E5B]/85 dark:text-[#D5E2E6]">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26]">
            <span className="w-6 h-6 rounded-full bg-[#344E5B] dark:bg-[#E98F7B] text-white flex items-center justify-center font-bold shrink-0">
              1
            </span>
            <div>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-0.5">Salin Seluruh Prompt Tanpa Memotong</strong>
              <p className="leading-relaxed">
                Pada halaman hasil prompt, klik tombol <strong>Salin Prompt</strong>. Seluruh 30 seksi spesifikasi saling terhubung agar Gemini menghasilkan level, audio, kunci jawaban, dan tampilan yang konsisten.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26]">
            <span className="w-6 h-6 rounded-full bg-[#344E5B] dark:bg-[#E98F7B] text-white flex items-center justify-center font-bold shrink-0">
              2
            </span>
            <div>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-0.5">Tempel di Google Gemini & Aktifkan Canvas (Jika Tersedia)</strong>
              <p className="leading-relaxed">
                Buka <strong>gemini.google.com/app</strong>, aktifkan tombol <strong>Canvas</strong> jika tersedia di kolom chat, tekan <strong>Ctrl + V</strong> (atau Cmd + V), lalu kirim. Gemini akan langsung membangun game interaktif siap main.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26]">
            <span className="w-6 h-6 rounded-full bg-[#344E5B] dark:bg-[#E98F7B] text-white flex items-center justify-center font-bold shrink-0">
              3
            </span>
            <div>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9] block mb-0.5">Sempurnakan atau Uji Langsung di AUNARA</strong>
              <p className="leading-relaxed">
                Ingin langsung melihat hasilnya tanpa berpindah tab? Buka tab <strong>Uji Live di Gemini AI</strong> di halaman hasil prompt AUNARA, mainkan dalam mode layar penuh, lalu klik <strong>Unduh Game (.html)</strong> untuk disimpan.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#6CAAA4]/10 border border-[#6CAAA4]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs">
            <Gamepad2 className="w-4 h-4 text-[#6CAAA4] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9] block">Ingin Mencoba di Google Gemini Sekarang?</strong>
              <span className="text-[#344E5B]/75 dark:text-[#A9BCA6]">
                Buka tab Google Gemini atau unduh panduan ini dalam bentuk PDF sebagai pegangan offline.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFFDF8] dark:bg-[#1C2D36] text-[#344E5B] dark:text-[#F7F2E9] border border-[#344E5B]/15 dark:border-white/15 hover:border-[#6CAAA4]"
            >
              <Download className="w-3.5 h-3.5 text-[#6CAAA4]" />
              <span>Unduh PDF</span>
            </button>
            <a
              href="https://gemini.google.com/app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#344E5B] dark:bg-[#E98F7B] hover:bg-[#22343E] dark:hover:bg-[#D4755F] transition-colors"
            >
              <span>Buka Gemini</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 5: Interactive Troubleshooting & FAQ */}
      <section className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D9CBEA]/40 text-[#344E5B] dark:text-[#D9CBEA] flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
              5. Pertanyaan Umum & Pemecahan Masalah (FAQ)
            </h3>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Klik pertanyaan di bawah untuk melihat solusi praktis.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#344E5B]/10 dark:border-white/10 bg-[#F7F2E9]/60 dark:bg-[#131F26] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#F7F2E9] dark:hover:bg-white/5 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#E98F7B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#344E5B]/50 dark:text-[#A9BCA6] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] leading-relaxed border-t border-[#344E5B]/5 dark:border-white/5 pt-2.5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
