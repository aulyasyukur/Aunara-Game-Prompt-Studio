/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SavedPrompt, GameConfig } from '../../types/game';
import { TEMPLATES } from '../../data/templates';
import { StorageService } from '../../services/storage';
import { downloadAunaraGuidePdf } from '../../services/pdfGuide';
import {
  Plus,
  Compass,
  FileCode,
  Users2,
  Gamepad2,
  ArrowRight,
  BookOpen,
  Layers,
  Download
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
  onOpenPrompt: (prompt: SavedPrompt) => void;
  onUseTemplate: (config: GameConfig) => void;
  prompts: SavedPrompt[];
  characterCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenPrompt,
  onUseTemplate,
  prompts,
  characterCount
}) => {
  const featuredTemplates = [
    TEMPLATES.find((t) => t.id === 'paud-01')!,
    TEMPLATES.find((t) => t.id === 'tk-01')!,
    TEMPLATES.find((t) => t.id === 'sd-01')!,
    TEMPLATES.find((t) => t.id === 'smp-01')!,
    TEMPLATES.find((t) => t.id === 'sma-01')!
  ].filter(Boolean);

  const recentPrompts = prompts.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Functional Hero Section */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-3xl border border-[#344E5B]/10 dark:border-white/10 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#6CAAA4] mb-2">
            AUNARA · Create • Play • Learn
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#344E5B] dark:text-[#F7F2E9] leading-tight">
            Rancang Prompt & Uji Game Edukasi Interaktif
          </h2>
          <p className="text-xs sm:text-sm text-[#344E5B]/75 dark:text-[#D5E2E6] mt-2.5 leading-relaxed">
            Susun rancangan game pembelajaran 5–50 level yang siap dijalankan di Google Gemini, uji pratinjau langsung di studio dalam mode layar penuh, dan unduh hasilnya.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('creator')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Buat Game Baru</span>
            </button>

            <button
              onClick={() => onNavigate('templates')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#344E5B] dark:text-[#F7F2E9] bg-[#F7F2E9] dark:bg-[#131F26] hover:bg-[#A9BCA6]/25 dark:hover:bg-white/10 border border-[#344E5B]/15 dark:border-white/10 transition-colors"
            >
              <Compass className="w-4 h-4 text-[#6CAAA4]" />
              <span>Pilih Template ({TEMPLATES.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Functional KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('history')}
          className="text-left bg-[#FFFDF8] dark:bg-[#1C2D36] hover:border-[#E98F7B] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#344E5B]/70 dark:text-[#A9BCA6]">Prompt Dibuat</span>
            <div className="w-7 h-7 rounded-lg bg-[#E98F7B]/15 text-[#E98F7B] flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#344E5B] dark:text-[#F7F2E9] font-mono tabular-nums">
            {prompts.length}
          </div>
          <span className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6]/80 mt-0.5 block">
            Tersimpan di Prompt Saya
          </span>
        </button>

        <button
          onClick={() => onNavigate('templates')}
          className="text-left bg-[#FFFDF8] dark:bg-[#1C2D36] hover:border-[#6CAAA4] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#344E5B]/70 dark:text-[#A9BCA6]">Template Kurikulum</span>
            <div className="w-7 h-7 rounded-lg bg-[#6CAAA4]/20 text-[#6CAAA4] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#344E5B] dark:text-[#F7F2E9] font-mono tabular-nums">
            {TEMPLATES.length}
          </div>
          <span className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6]/80 mt-0.5 block">
            Jenjang PAUD hingga SMA
          </span>
        </button>

        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#344E5B]/70 dark:text-[#A9BCA6]">Kapasitas Level</span>
            <div className="w-7 h-7 rounded-lg bg-[#A9BCA6]/30 text-[#344E5B] dark:text-[#A9BCA6] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#344E5B] dark:text-[#F7F2E9] font-mono tabular-nums">
            50
          </div>
          <span className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6]/80 mt-0.5 block">
            Maksimal level per game
          </span>
        </div>

        <button
          onClick={() => onNavigate('characters')}
          className="text-left bg-[#FFFDF8] dark:bg-[#1C2D36] hover:border-[#D9CBEA] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-4 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#344E5B]/70 dark:text-[#A9BCA6]">Karakter Studio</span>
            <div className="w-7 h-7 rounded-lg bg-[#D9CBEA]/40 text-[#344E5B] dark:text-[#D9CBEA] flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#344E5B] dark:text-[#F7F2E9] font-mono tabular-nums">
            {characterCount}
          </div>
          <span className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6]/80 mt-0.5 block">
            Maskot & karakter kustom
          </span>
        </button>
      </div>

      {/* Two Column Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Prompts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
              Riwayat Prompt Terakhir
            </h3>
            {prompts.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-bold text-[#E98F7B] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua ({prompts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentPrompts.length === 0 ? (
            <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E98F7B]/15 text-[#E98F7B] mx-auto flex items-center justify-center mb-3">
                <FileCode className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                Belum Ada Prompt yang Tersimpan
              </h4>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1 max-w-sm mx-auto">
                Buat prompt game edukasi pertama Anda sekarang dalam waktu kurang dari 2 menit atau pilih dari 65+ template kurikulum.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => onNavigate('creator')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#344E5B] dark:bg-[#E98F7B] hover:bg-[#22343E] dark:hover:bg-[#D4755F] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mulai Buat Game</span>
                </button>
                <button
                  onClick={() => onNavigate('templates')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 hover:border-[#6CAAA4]"
                >
                  <Compass className="w-3.5 h-3.5 text-[#6CAAA4]" />
                  <span>Lihat Template</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPrompts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenPrompt(item)}
                  className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-[#E98F7B]/50 p-4 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#EBF1F3] group-hover:bg-[#E98F7B] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E98F7B]/15 text-[#E98F7B]">
                          {item.summary.level}
                        </span>
                        <span className="text-[11px] font-semibold text-[#6CAAA4]">
                          {item.summary.subject}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] truncate group-hover:text-[#E98F7B] transition-colors">
                        {item.summary.title}
                      </h4>
                      <p className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6] truncate">
                        {item.summary.genre} · {item.summary.totalLevels} Level
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#344E5B]/50 dark:text-[#A9BCA6]/70 hidden sm:inline">
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#344E5B]/40 dark:text-[#A9BCA6] group-hover:text-[#E98F7B] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Functional Quick Access */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
            Akses Cepat Studio
          </h3>

          <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-4 space-y-2.5 shadow-xs">
            <button
              onClick={() => onNavigate('templates')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#6CAAA4]/15 hover:bg-[#6CAAA4]/25 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#6CAAA4]" />
                <div>
                  <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block">Template Game</span>
                  <span className="text-[10px] text-[#344E5B]/65 dark:text-[#A9BCA6]">65+ kurikulum PAUD–SMA siap pakai</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#344E5B]/40 dark:text-[#A9BCA6]" />
            </button>

            <button
              onClick={() => onNavigate('characters')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F7F2E9]/70 dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/5 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users2 className="w-4 h-4 text-[#6CAAA4]" />
                <div>
                  <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block">Karakter Saya</span>
                  <span className="text-[10px] text-[#344E5B]/65 dark:text-[#A9BCA6]">Kelola maskot & unggah gambar</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#344E5B]/40 dark:text-[#A9BCA6]" />
            </button>

            <button
              onClick={() => onNavigate('guide')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F7F2E9]/70 dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/5 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#E98F7B]" />
                <div>
                  <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block">Panduan Lengkap</span>
                  <span className="text-[10px] text-[#344E5B]/65 dark:text-[#A9BCA6]">Langkah praktis & tips per jenjang</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#344E5B]/40 dark:text-[#A9BCA6]" />
            </button>

            <button
              onClick={downloadAunaraGuidePdf}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#E98F7B]/12 hover:bg-[#E98F7B]/20 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-[#E98F7B]" />
                <div>
                  <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block">Unduh Panduan (PDF)</span>
                  <span className="text-[10px] text-[#344E5B]/65 dark:text-[#A9BCA6]">Buku saku A4 siap cetak</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#344E5B]/40 dark:text-[#A9BCA6]" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Templates Showcase */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
              Rekomendasi Template Kurikulum
            </h3>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Pilihan terpopuler dari jenjang PAUD, TK, SD, SMP, hingga SMA.
            </p>
          </div>
          <button
            onClick={() => onNavigate('templates')}
            className="text-xs font-bold text-[#E98F7B] hover:underline flex items-center gap-1"
          >
            <span>Buka Semua Template ({TEMPLATES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {featuredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-[#E98F7B]/50 p-4 shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#E98F7B]/15 text-[#E98F7B]">
                    {tpl.level}
                  </span>
                  <span className="text-[11px] font-semibold text-[#6CAAA4] truncate max-w-[100px]">
                    {tpl.subject}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-[#344E5B] dark:text-[#F7F2E9] group-hover:text-[#E98F7B] transition-colors line-clamp-1 mt-1">
                  {tpl.name}
                </h4>

                <p className="text-[11px] text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              <button
                onClick={() => {
                  const chars = StorageService.getCharacters();
                  onUseTemplate({
                    level: tpl.level,
                    targetAge: tpl.targetAge,
                    playerCharacteristics: '',
                    subject: tpl.subject,
                    gameTitle: tpl.name,
                    mainTopic: tpl.defaultTopic,
                    subtopics: tpl.defaultSubtopics,
                    learningObjectives: tpl.learningObjectives,
                    targetCompetencies: tpl.defaultCompetencies,
                    priorKnowledge: '',
                    genre: tpl.genre,
                    mechanics: tpl.mechanics,
                    theme: tpl.theme,
                    artStyle: tpl.artStyle,
                    characters: [chars[0]],
                    levelSettings: {
                      levelCount: tpl.recommendedLevels,
                      challengesPerLevel: 3,
                      questionsPerLevel: 4,
                      durationPerLevel: '3-5 Menit',
                      difficultyCurve: 'Gradual Linear',
                      livesCount: tpl.level === 'PAUD' ? 0 : 3,
                      scoringSystem: 'Poin Skor + Multiplier Kombo',
                      hasStars: true,
                      hasCoins: true,
                      hasHints: true,
                      bossInterval: 5,
                      finalChallengeName: 'Ujian Agung Puncak Pengetahuan',
                      endingNarrative: 'Permainan berhasil dituntaskan dengan sempurna.'
                    }
                  });
                }}
                className="mt-3 w-full py-1.5 text-xs font-bold rounded-lg bg-[#F7F2E9] dark:bg-[#131F26] hover:bg-[#E98F7B] dark:hover:bg-[#E98F7B] hover:text-white text-[#344E5B] dark:text-[#F7F2E9] transition-all flex items-center justify-center gap-1"
              >
                <span>Gunakan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
