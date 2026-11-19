/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TEMPLATES } from '../../data/templates';
import { EducationalTemplate, GameConfig } from '../../types/game';
import { SUBJECT_TOPICS_RECOMMENDATIONS } from '../../data/subjects';
import { StorageService } from '../../services/storage';
import { Search, ArrowRight, X } from 'lucide-react';

interface TemplateLibraryProps {
  onUseTemplate: (config: GameConfig) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onUseTemplate }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<EducationalTemplate | null>(null);

  const levels = ['SEMUA', 'PAUD', 'TK', 'SD', 'SMP', 'SMA'];

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      if (selectedLevel !== 'SEMUA' && tpl.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tpl.name.toLowerCase().includes(q);
        const matchDesc = tpl.description.toLowerCase().includes(q);
        const matchSubject = tpl.subject.toLowerCase().includes(q);
        const matchTopic = tpl.defaultTopic.toLowerCase().includes(q);
        return matchName || matchDesc || matchSubject || matchTopic;
      }
      return true;
    });
  }, [selectedLevel, searchQuery]);

  const handleApplyTemplate = (tpl: EducationalTemplate) => {
    const chars = StorageService.getCharacters();
    const config: GameConfig = {
      level: tpl.level,
      targetAge: tpl.targetAge,
      playerCharacteristics: '',
      subject: tpl.subject,
      gameTitle: tpl.name,
      mainTopic: tpl.defaultTopic,
      subtopics: tpl.defaultSubtopics,
      learningObjectives: tpl.learningObjectives,
      targetCompetencies: tpl.defaultCompetencies,
      priorKnowledge: SUBJECT_TOPICS_RECOMMENDATIONS[tpl.subject]?.priorKnowledge || '',
      genre: tpl.genre,
      mechanics: tpl.mechanics,
      theme: tpl.theme,
      artStyle: tpl.artStyle,
      characters: [chars[0] || {
        id: 'c1',
        name: 'Auna',
        role: 'Protagonis Utama',
        description: 'Pahlawan cilik penjelajah yang cerdik.',
        dominantColor: '#E98F7B'
      }],
      levelSettings: {
        levelCount: tpl.recommendedLevels,
        challengesPerLevel: 3,
        questionsPerLevel: 4,
        durationPerLevel: '3-5 Menit',
        difficultyCurve: 'Gradual Linear',
        livesCount: 3,
        scoringSystem: 'Poin Skor + Multiplier Kombo',
        hasStars: true,
        hasCoins: true,
        hasHints: true,
        bossInterval: 5,
        finalChallengeName: 'Ujian Akhir Puncak Kebijaksanaan',
        endingNarrative: 'Seluruh materi berhasil dikuasai dengan cemerlang!'
      }
    };

    onUseTemplate(config);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#6CAAA4]/20 text-[#344E5B] dark:text-[#84C2BC]">
                Pustaka Terkurasi
              </span>
              <span className="text-xs font-semibold text-[#E98F7B]">
                {TEMPLATES.length} Template Tersedia
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#344E5B] dark:text-[#F7F2E9]">
              Template Game Edukasi
            </h2>
            <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] mt-1 max-w-2xl">
              Pilih dari 65+ cetak biru kurikulum lengkap untuk PAUD, TK, SD, SMP, hingga SMA. Klik "Gunakan" untuk mengisi seluruh formulir generator secara instan.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[#344E5B]/40 dark:text-[#A9BCA6] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, matematika, sains..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/45 dark:placeholder:text-[#A9BCA6]/60 focus:outline-none focus:ring-2 focus:ring-[#E98F7B]"
            />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#344E5B]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {levels.map((lvl) => {
              const isSelected = selectedLevel === lvl;
              const count = lvl === 'SEMUA' ? TEMPLATES.length : TEMPLATES.filter((t) => t.level === lvl).length;

              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white shadow-2xs'
                      : 'bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B]/80 dark:text-[#A9BCA6] hover:bg-[#A9BCA6]/30 dark:hover:bg-white/10'
                  }`}
                >
                  {lvl} <span className="opacity-70 text-[10px] ml-1 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-[#344E5B]/60 dark:text-[#A9BCA6] font-medium">
            Menampilkan <strong>{filteredTemplates.length}</strong> template
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => {
          return (
            <div
              key={tpl.id}
              className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-[#E98F7B]/50 p-5 shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E98F7B]/15 text-[#E98F7B]">
                    {tpl.level} · {tpl.targetAge}
                  </span>
                  <span className="text-xs font-semibold text-[#6CAAA4]">
                    {tpl.subject}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9] group-hover:text-[#E98F7B] transition-colors line-clamp-1">
                  {tpl.name}
                </h3>

                <p className="text-xs text-[#344E5B]/75 dark:text-[#D5E2E6] mt-1.5 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="mt-3.5 space-y-1.5 text-[11px] text-[#344E5B]/80 dark:text-[#D5E2E6] bg-[#F7F2E9]/60 dark:bg-[#131F26] p-2.5 rounded-xl border border-[#344E5B]/5 dark:border-white/5">
                  <div className="flex justify-between">
                    <span className="text-[#344E5B]/60 dark:text-[#A9BCA6]">Genre:</span>
                    <strong className="text-[#344E5B] dark:text-[#F7F2E9] truncate max-w-[150px]">{tpl.genre}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#344E5B]/60 dark:text-[#A9BCA6]">Tema:</span>
                    <strong className="text-[#344E5B] dark:text-[#F7F2E9] truncate max-w-[150px]">{tpl.theme}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#344E5B]/60 dark:text-[#A9BCA6]">Level Disarankan:</span>
                    <strong className="text-[#E98F7B]">{tpl.recommendedLevels} Level</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#344E5B]/10 dark:border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#F7F2E9] dark:hover:bg-white/10 transition-colors text-center"
                >
                  Detail
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] text-white shadow-2xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>Gunakan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#344E5B]/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl max-w-lg w-full p-6 border border-[#344E5B]/15 dark:border-white/15 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#344E5B]/10 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#E98F7B]/15 text-[#E98F7B]">
                    {previewTemplate.level} · {previewTemplate.targetAge}
                  </span>
                  <span className="text-xs font-semibold text-[#6CAAA4]">
                    {previewTemplate.subject}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#344E5B] dark:text-[#F7F2E9]">
                  {previewTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 rounded-lg text-[#344E5B]/60 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white hover:bg-[#F7F2E9] dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs text-[#344E5B] dark:text-[#EBF1F3]">
              <div>
                <h4 className="font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1">Deskripsi Konsep:</h4>
                <p className="text-[#344E5B]/80 dark:text-[#D5E2E6] leading-relaxed bg-[#F7F2E9] dark:bg-[#131F26] p-3 rounded-xl">
                  {previewTemplate.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1">Tujuan Pembelajaran:</h4>
                <p className="text-[#344E5B]/80 dark:text-[#D5E2E6] leading-relaxed">
                  {previewTemplate.learningObjectives}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
                <div>
                  <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] block text-[10px]">Genre Permainan</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{previewTemplate.genre}</strong>
                </div>
                <div>
                  <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] block text-[10px]">Tema Dunia</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{previewTemplate.theme}</strong>
                </div>
                <div>
                  <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] block text-[10px]">Gaya Seni</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{previewTemplate.artStyle}</strong>
                </div>
                <div>
                  <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] block text-[10px]">Rekomendasi Level</span>
                  <strong className="text-[#E98F7B]">{previewTemplate.recommendedLevels} Level</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1">Mekanisme Permainan:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {previewTemplate.mechanics.map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-lg bg-[#344E5B]/10 dark:bg-white/10 text-[#344E5B] dark:text-[#F7F2E9] font-semibold text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#344E5B]/10 dark:border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#344E5B]/20 dark:border-white/20 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#F7F2E9] dark:hover:bg-white/10"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleApplyTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] shadow-xs"
              >
                Gunakan Template Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
