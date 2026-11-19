/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gamepad2, GraduationCap, Layers, Cpu } from 'lucide-react';
import { AunaraLogo } from '../common/AunaraLogo';

export const AboutAunara: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Brand Hero */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-8 shadow-xs text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E98F7B]/15 text-[#E98F7B] text-xs font-bold uppercase tracking-wider mb-5">
          SaaS Educational Architecture
        </div>

        <div className="flex justify-center mb-2">
          <AunaraLogo size="xl" layout="vertical" showWordmark={true} showTagline={true} />
        </div>

        <p className="text-xs sm:text-sm text-[#344E5B]/80 dark:text-[#D5E2E6] max-w-2xl mx-auto mt-4 leading-relaxed">
          AUNARA Game Prompt Studio V.1.0. Kami memberdayakan guru, orang tua, sekolah, dan kreator konten untuk mengubah materi kurikulum yang rumit menjadi game petualangan interaktif yang hidup, bermakna, dan menyenangkan bagi anak.
        </p>
      </div>

      {/* Brand Identity & Palette */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9] mb-2">
          Identitas Visual & Harmoni Palet Warna
        </h3>
        <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] leading-relaxed mb-4">
          Dirancang dengan estetika ramah anak yang lembut, modern, dan profesional tanpa warna neon yang menyilaukan mata:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#F7F2E9] mx-auto mb-1.5 border border-slate-300" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">Cream</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#F7F2E9</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#E98F7B] mx-auto mb-1.5 shadow-2xs" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">Coral</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#E98F7B</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#A9BCA6] mx-auto mb-1.5 shadow-2xs" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">Sage</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#A9BCA6</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#6CAAA4] mx-auto mb-1.5 shadow-2xs" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">Teal</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#6CAAA4</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#344E5B] mx-auto mb-1.5 shadow-2xs" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">Navy</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#344E5B</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#D9CBEA] mx-auto mb-1.5 shadow-2xs" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">Lavender</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#D9CBEA</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#FFFDF8] mx-auto mb-1.5 border border-slate-300" />
            <strong className="block text-[#344E5B] dark:text-[#F7F2E9]">White</strong>
            <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] font-mono">#FFFDF8</span>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#E98F7B]/15 text-[#E98F7B] flex items-center justify-center">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
            Standar Game Fungsional 100%
          </h4>
          <p className="text-[#344E5B]/75 dark:text-[#D5E2E6] leading-relaxed">
            Prompt AUNARA mewajibkan AI membangun game yang benar-benar dapat dimainkan di browser dengan main menu, peta level, kontrol interaktif, sistem skor, nyawa, feedback suara, dan layar tamat. Tidak ada tombol palsu.
          </p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#6CAAA4]/20 text-[#6CAAA4] flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
            Integrasi Kurikulum & Taksonomi Bloom
          </h4>
          <p className="text-[#344E5B]/75 dark:text-[#D5E2E6] leading-relaxed">
            Menyelaraskan materi pelajaran dengan kurikulum nasional (Kurikulum Merdeka / K13) dan membagi progresi level dari mengingat dasar (C1) hingga berpikir tingkat tinggi HOTS (C4–C6).
          </p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#A9BCA6]/30 text-[#344E5B] dark:text-[#A9BCA6] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
            Advanced Level Design Engine
          </h4>
          <p className="text-[#344E5B]/75 dark:text-[#D5E2E6] leading-relaxed">
            Mampu menyusun petualangan panjang hingga 50 level dengan pembagian babak (worlds), boss battle milestone berkala, kurva kesulitan linier bertahap, dan syarat pembukaan level (gating).
          </p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#D9CBEA]/40 text-[#344E5B] dark:text-[#D9CBEA] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
            Privasi & Asisten AI Terintegrasi
          </h4>
          <p className="text-[#344E5B]/75 dark:text-[#D5E2E6] leading-relaxed">
            Menyimpan riwayat karya secara aman di LocalStorage pengguna dan dilengkapi asisten Chat AI interaktif untuk berdiskusi ide game, bank soal, dan desain pedagogi secara langsung.
          </p>
        </div>
      </div>
    </div>
  );
};
