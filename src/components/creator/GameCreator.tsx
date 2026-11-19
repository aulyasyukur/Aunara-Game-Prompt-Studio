/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EducationLevel,
  SubjectCategory,
  GameGenre,
  GameMechanic,
  GameTheme,
  ArtStyle,
  GameConfig,
  GameCharacter
} from '../../types/game';
import {
  EDUCATION_LEVELS,
  SUBJECT_TOPICS_RECOMMENDATIONS,
  ALL_GENRES,
  ALL_MECHANICS,
  ALL_THEMES,
  ALL_ART_STYLES
} from '../../data/subjects';
import { InteractiveLevelMap } from './InteractiveLevelMap';
import { calculateChapters, generateSampleLevels } from '../../services/promptEngine';
import { StorageService } from '../../services/storage';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Gamepad2,
  Palette,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  Wand2
} from 'lucide-react';

interface GameCreatorProps {
  initialConfig?: Partial<GameConfig>;
  onGenerate: (config: GameConfig) => void;
  onCancel?: () => void;
}

export const GameCreator: React.FC<GameCreatorProps> = ({
  initialConfig,
  onGenerate,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const savedCharacters = StorageService.getCharacters();

  const [config, setConfig] = useState<GameConfig>(() => {
    const defaultLevel: EducationLevel = initialConfig?.level || 'SD';
    const defaultSubject: SubjectCategory = initialConfig?.subject || 'Matematika';
    const rec = SUBJECT_TOPICS_RECOMMENDATIONS[defaultSubject];

    return {
      level: defaultLevel,
      customAgeRange: initialConfig?.customAgeRange || '',
      customGrade: initialConfig?.customGrade || '',
      targetAge: initialConfig?.targetAge || EDUCATION_LEVELS[defaultLevel].defaultAge,
      playerCharacteristics: initialConfig?.playerCharacteristics || '',

      subject: defaultSubject,
      customSubject: initialConfig?.customSubject || '',

      gameTitle: initialConfig?.gameTitle || 'Petualangan Angka Rimba Ajaib',
      mainTopic: initialConfig?.mainTopic || rec.defaultTopic,
      subtopics: initialConfig?.subtopics || rec.subtopics,
      learningObjectives: initialConfig?.learningObjectives || rec.objectives,
      targetCompetencies: initialConfig?.targetCompetencies || rec.competencies,
      priorKnowledge: initialConfig?.priorKnowledge || rec.priorKnowledge,

      genre: initialConfig?.genre || 'Educational Adventure',
      customGenre: initialConfig?.customGenre || '',
      mechanics: initialConfig?.mechanics || ['Multiple Choice', 'Drag and Drop', 'Solve Puzzles'],
      customMechanic: initialConfig?.customMechanic || '',

      theme: initialConfig?.theme || 'Hutan Ajaib',
      customTheme: initialConfig?.customTheme || '',
      artStyle: initialConfig?.artStyle || '2D Illustration',
      characters: initialConfig?.characters || [savedCharacters[0] || {
        id: 'c1',
        name: 'Auna',
        role: 'Protagonis Utama',
        description: 'Kancil cilik yang cerdik dan suka membantu teman memecahkan teka-teki.',
        dominantColor: '#E98F7B'
      }],

      levelSettings: initialConfig?.levelSettings || {
        levelCount: 15,
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
        finalChallengeName: 'Ujian Agung Penjaga Kebijaksanaan',
        endingNarrative: 'Cahaya ilmu pengetahuan kembali bersinar terang di seluruh penjuru negeri.'
      }
    };
  });

  const handleLevelChange = (lvl: EducationLevel) => {
    const meta = EDUCATION_LEVELS[lvl];
    setConfig((prev) => ({
      ...prev,
      level: lvl,
      targetAge: meta.defaultAge,
      genre: meta.recommendedGenres[0] || prev.genre,
      mechanics: meta.recommendedMechanics.slice(0, 3),
      artStyle: meta.recommendedArtStyles[0] || prev.artStyle
    }));
  };

  const handleSubjectChange = (sub: SubjectCategory) => {
    const rec = SUBJECT_TOPICS_RECOMMENDATIONS[sub];
    setConfig((prev) => ({
      ...prev,
      subject: sub,
      mainTopic: rec ? rec.defaultTopic : prev.mainTopic,
      subtopics: rec ? rec.subtopics : prev.subtopics,
      learningObjectives: rec ? rec.objectives : prev.learningObjectives,
      targetCompetencies: rec ? rec.competencies : prev.targetCompetencies,
      priorKnowledge: rec ? rec.priorKnowledge : prev.priorKnowledge
    }));
  };

  const toggleMechanic = (mech: GameMechanic) => {
    setConfig((prev) => {
      const exists = prev.mechanics.includes(mech);
      if (exists) {
        if (prev.mechanics.length <= 1) return prev;
        return { ...prev, mechanics: prev.mechanics.filter((m) => m !== mech) };
      } else {
        return { ...prev, mechanics: [...prev.mechanics, mech] };
      }
    });
  };

  const toggleCharacter = (char: GameCharacter) => {
    setConfig((prev) => {
      const exists = prev.characters.some((c) => c.id === char.id);
      if (exists) {
        if (prev.characters.length <= 1) return prev;
        return { ...prev, characters: prev.characters.filter((c) => c.id !== char.id) };
      } else {
        return { ...prev, characters: [...prev.characters, char] };
      }
    });
  };

  const steps = [
    { num: 1, title: 'Jenjang & Usia', icon: GraduationCap },
    { num: 2, title: 'Mata Pelajaran', icon: BookOpen },
    { num: 3, title: 'Materi & Capaian', icon: Wand2 },
    { num: 4, title: 'Genre & Mekanik', icon: Gamepad2 },
    { num: 5, title: 'Tema & Karakter', icon: Palette },
    { num: 6, title: 'Level & Progresi', icon: Sliders },
    { num: 7, title: 'Tinjau & Generate', icon: Sparkles }
  ];

  const chaptersPreview = calculateChapters(config.levelSettings.levelCount, config.theme);
  const sampleLevelsPreview = generateSampleLevels(config, chaptersPreview);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onGenerate(config);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCancel) {
      onCancel();
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-xs rounded-lg border border-[#344E5B]/20 dark:border-white/15 bg-white dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/45 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#E98F7B]';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Wizard Header Bar */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#344E5B] dark:text-[#F7F2E9]">
              Smart Game Creator
            </h2>
            <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
              Rancang game edukasi interaktif langkah demi langkah dengan panduan pedagogi pintar.
            </p>
          </div>
          <div className="text-xs font-bold text-[#E98F7B] bg-[#E98F7B]/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Langkah {currentStep} dari 7: {steps[currentStep - 1]?.title}
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {steps.map((st) => {
            const isDone = st.num < currentStep;
            const isCurrent = st.num === currentStep;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all text-center ${
                  isCurrent
                    ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white shadow-2xs'
                    : isDone
                    ? 'bg-[#A9BCA6]/25 dark:bg-[#6CAAA4]/20 text-[#344E5B] dark:text-[#EBF1F3] hover:bg-[#A9BCA6]/40'
                    : 'bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B]/50 dark:text-[#A9BCA6]/50 hover:bg-[#F7F2E9]/80 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-[#E98F7B] dark:text-white' : ''}`} />
                  )}
                  <span className="text-[11px] font-black hidden sm:inline">
                    {st.num}
                  </span>
                </div>
                <span className="text-[10px] font-semibold truncate max-w-full hidden md:inline">
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Body Container */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 sm:p-8 shadow-xs">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                1. Pilih Jenjang Pendidikan Sasaran
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                AUNARA secara otomatis menyesuaikan tingkat kesulitan kognitif, ukuran tombol, dan gaya bahasa sesuai usia pemain.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['PAUD', 'TK', 'SD', 'SMP', 'SMA', 'CUSTOM'] as EducationLevel[]).map((lvl) => {
                const meta = EDUCATION_LEVELS[lvl];
                const isSelected = config.level === lvl;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelChange(lvl)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#E98F7B]/10 dark:bg-[#E98F7B]/20 border-[#E98F7B] shadow-2xs'
                        : 'bg-[#F7F2E9]/50 dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-black text-[#344E5B] dark:text-[#F7F2E9]">{lvl}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#E98F7B]" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-[#E98F7B] block">
                      {meta.defaultAge}
                    </span>
                    <p className="text-[11px] text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1 line-clamp-2">
                      {meta.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {config.level === 'CUSTOM' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
                <div>
                  <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                    Rentang Usia Custom
                  </label>
                  <input
                    type="text"
                    value={config.customAgeRange || ''}
                    onChange={(e) => setConfig({ ...config, customAgeRange: e.target.value })}
                    placeholder="Contoh: 19–24 Tahun / Dewasa"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                    Tingkat Kelas / Audiens
                  </label>
                  <input
                    type="text"
                    value={config.customGrade || ''}
                    onChange={(e) => setConfig({ ...config, customGrade: e.target.value })}
                    placeholder="Contoh: Mahasiswa / Pelatihan Guru"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gradient-to-r from-[#A9BCA6]/15 to-[#6CAAA4]/15 dark:from-[#6CAAA4]/15 dark:to-[#344E5B]/30 border border-[#344E5B]/10 dark:border-white/10">
              <h4 className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#6CAAA4]" />
                <span>Pedoman Desain Adaptif untuk Jenjang {config.level}:</span>
              </h4>
              <ul className="text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] space-y-1">
                <li>• <strong>Visual:</strong> {EDUCATION_LEVELS[config.level].designGuidelines.visuals}</li>
                <li>• <strong>Instruksi:</strong> {EDUCATION_LEVELS[config.level].designGuidelines.textLength}</li>
                <li>• <strong>Sistem Hukuman:</strong> {EDUCATION_LEVELS[config.level].designGuidelines.penalty}</li>
              </ul>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                Karakteristik Khusus Pemain (Opsional)
              </label>
              <textarea
                value={config.playerCharacteristics}
                onChange={(e) => setConfig({ ...config, playerCharacteristics: e.target.value })}
                rows={2}
                placeholder="Contoh: Pemain mudah bosan bila teks terlalu panjang, menyukai reward animasi lucu, dan lebih suka eksplorasi visual."
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                2. Pilih Mata Pelajaran
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                Pilih mata pelajaran kurikulum untuk memuat rekomendasi topik pembelajaran otomatis.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  'Matematika',
                  'Bahasa Indonesia',
                  'Bahasa Inggris',
                  'IPA',
                  'IPAS',
                  'IPS',
                  'Pendidikan Agama Islam',
                  'Sejarah',
                  'Geografi',
                  'Biologi',
                  'Fisika',
                  'Kimia',
                  'Ekonomi',
                  'Informatika',
                  'Pancasila',
                  'Literasi',
                  'Numerasi',
                  'Pengetahuan Umum',
                  'Seni dan Kreativitas',
                  'CUSTOM'
                ] as SubjectCategory[]
              ).map((sub) => {
                const isSelected = config.subject === sub;

                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubjectChange(sub)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#344E5B] dark:bg-[#E98F7B] border-[#344E5B] dark:border-[#E98F7B] text-white shadow-2xs font-bold'
                        : 'bg-[#F7F2E9]/60 dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:bg-[#A9BCA6]/20 dark:hover:bg-white/5 text-[#344E5B] dark:text-[#EBF1F3]'
                    }`}
                  >
                    <span className="text-xs">{sub}</span>
                  </button>
                );
              })}
            </div>

            {config.subject === 'CUSTOM' && (
              <div className="p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10">
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Nama Mata Pelajaran Kustom
                </label>
                <input
                  type="text"
                  value={config.customSubject || ''}
                  onChange={(e) => setConfig({ ...config, customSubject: e.target.value })}
                  placeholder="Contoh: Pendidikan Lingkungan Hidup, Robotika Dasar, Astronomi Cilik"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                3. Detail Materi & Capaian Pembelajaran
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                Tentukan topik, subtopik, dan target pemahaman siswa. Form ini telah terisi otomatis berdasarkan mata pelajaran yang Anda pilih.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                Nama Game Edukasi
              </label>
              <input
                type="text"
                value={config.gameTitle}
                onChange={(e) => setConfig({ ...config, gameTitle: e.target.value })}
                placeholder="Contoh: Petualangan Angka Rimba Ajaib"
                className={`${inputClass} py-2.5 font-semibold`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Topik Utama
                </label>
                <input
                  type="text"
                  value={config.mainTopic}
                  onChange={(e) => setConfig({ ...config, mainTopic: e.target.value })}
                  placeholder="Contoh: Operasi Bilangan dan Pecahan Sederhana"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Subtopik Rinci
                </label>
                <input
                  type="text"
                  value={config.subtopics}
                  onChange={(e) => setConfig({ ...config, subtopics: e.target.value })}
                  placeholder="Contoh: Penjumlahan, Pengurangan, Soal Cerita Belanja"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                Tujuan Pembelajaran (Learning Objectives)
              </label>
              <textarea
                value={config.learningObjectives}
                onChange={(e) => setConfig({ ...config, learningObjectives: e.target.value })}
                rows={3}
                placeholder="Apa yang diharapkan mampu dipahami dan dilakukan anak setelah bermain?"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Kompetensi yang Ingin Dicapai
                </label>
                <textarea
                  value={config.targetCompetencies}
                  onChange={(e) => setConfig({ ...config, targetCompetencies: e.target.value })}
                  rows={2}
                  placeholder="Contoh: Menghitung secara cepat, menganalisis pola, memecahkan masalah kontekstual."
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Pengetahuan Awal Pemain (Prior Knowledge)
                </label>
                <textarea
                  value={config.priorKnowledge}
                  onChange={(e) => setConfig({ ...config, priorKnowledge: e.target.value })}
                  rows={2}
                  placeholder="Contoh: Mengenal angka 1-20 dan penjumlahan satu digit."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                4. Genre Permainan & Mekanisme Interaktif
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                Pilih 1 genre utama dan satu atau beberapa mekanisme permainan yang dapat dimainkan.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-2">
                A. Genre Game Utama
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                {ALL_GENRES.map((g) => {
                  const isSelected = config.genre === g.genre;
                  return (
                    <button
                      key={g.genre}
                      type="button"
                      onClick={() => setConfig({ ...config, genre: g.genre })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#E98F7B]/10 dark:bg-[#E98F7B]/20 border-[#E98F7B] shadow-2xs'
                          : 'bg-[#F7F2E9]/60 dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-white/30'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-[#344E5B] dark:text-[#F7F2E9] block">
                        {g.title}
                      </span>
                      <p className="text-[10px] text-[#344E5B]/70 dark:text-[#A9BCA6] mt-0.5 line-clamp-2">
                        {g.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                  B. Mekanisme Interaksi Permainan (Dapat Pilih Lebih dari 1)
                </label>
                <span className="text-[11px] font-semibold text-[#6CAAA4]">
                  {config.mechanics.length} Terpilih
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_MECHANICS.map((m) => {
                  const isSelected = config.mechanics.includes(m.mechanic);
                  return (
                    <button
                      key={m.mechanic}
                      type="button"
                      onClick={() => toggleMechanic(m.mechanic)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white border-[#344E5B] dark:border-[#E98F7B] shadow-2xs'
                          : 'bg-[#FFFDF8] dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:bg-[#F7F2E9] dark:hover:bg-white/5 text-[#344E5B] dark:text-[#EBF1F3]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#E98F7B] dark:bg-[#344E5B] text-white' : 'border border-[#344E5B]/30 dark:border-white/30'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{m.label}</span>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-100' : 'text-[#344E5B]/60 dark:text-[#A9BCA6]'}`}>
                          {m.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                5. Tema Dunia, Gaya Visual & Karakter
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                Tentukan atmosfer visual dunia dan karakter pendamping petualangan belajar anak.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-2">
                A. Tema & Latar Dunia Permainan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ALL_THEMES.map((th) => {
                  const isSelected = config.theme === th.theme;
                  return (
                    <button
                      key={th.theme}
                      type="button"
                      onClick={() => setConfig({ ...config, theme: th.theme })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#E98F7B]/15 dark:bg-[#E98F7B]/25 border-[#E98F7B] shadow-2xs'
                          : 'bg-[#F7F2E9]/60 dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-white/30'
                      }`}
                    >
                      <span className="text-lg block mb-1">{th.icon}</span>
                      <strong className="text-xs text-[#344E5B] dark:text-[#F7F2E9] block">{th.title}</strong>
                      <p className="text-[10px] text-[#344E5B]/70 dark:text-[#A9BCA6] line-clamp-2 mt-0.5">{th.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-2">
                B. Gaya Seni Visual (Art Style)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {ALL_ART_STYLES.map((st) => {
                  const isSelected = config.artStyle === st.style;
                  return (
                    <button
                      key={st.style}
                      type="button"
                      onClick={() => setConfig({ ...config, artStyle: st.style })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white border-[#344E5B] dark:border-[#E98F7B] font-bold'
                          : 'bg-[#FFFDF8] dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:bg-[#F7F2E9] dark:hover:bg-white/5 text-[#344E5B] dark:text-[#EBF1F3]'
                      }`}
                    >
                      <span className="text-xs block">{st.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                  C. Karakter Game (Pilih dari Studio Karakter)
                </label>
                <span className="text-[11px] font-semibold text-[#6CAAA4]">
                  {config.characters.length} Karakter Dipakai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedCharacters.map((char) => {
                  const isSelected = config.characters.some((c) => c.id === char.id);

                  return (
                    <div
                      key={char.id}
                      onClick={() => toggleCharacter(char)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#FFFDF8] to-[#F7F2E9] dark:from-[#233640] dark:to-[#1C2D36] border-[#E98F7B] shadow-2xs'
                          : 'bg-[#FFFDF8] dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-white/30'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs"
                        style={{ backgroundColor: char.dominantColor || '#E98F7B' }}
                      >
                        {char.imageUrl ? (
                          <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          char.name.substring(0, 2).toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] truncate">
                            {char.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#344E5B]/10 dark:bg-white/10 text-[#344E5B] dark:text-[#EBF1F3]">
                            {char.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#344E5B]/70 dark:text-[#A9BCA6] truncate mt-0.5">
                          {char.description}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#E98F7B] text-white' : 'border border-[#344E5B]/20 dark:border-white/20'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                6. Pengaturan Jumlah Level & Mekanisme Reward
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                AUNARA mampu menyusun game berjenjang panjang hingga 50 level dengan variasi aktivitas dan boss battle berkala.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-2">
                A. Jumlah Level Permainan
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[5, 10, 15, 20, 30, 40, 50].map((num) => {
                  const isSelected = config.levelSettings.levelCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          levelSettings: { ...config.levelSettings, levelCount: num }
                        })
                      }
                      className={`py-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white border-[#344E5B] dark:border-[#E98F7B] shadow-2xs font-black'
                          : 'bg-[#F7F2E9]/60 dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:bg-[#A9BCA6]/20 dark:hover:bg-white/5 text-[#344E5B] dark:text-[#F7F2E9] font-bold'
                      }`}
                    >
                      <span className="text-sm block">{num}</span>
                      <span className={`text-[10px] block font-normal ${isSelected ? 'text-white/80' : 'text-[#344E5B]/60 dark:text-[#A9BCA6]'}`}>
                        Level
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Tantangan per Level
                </label>
                <select
                  value={config.levelSettings.challengesPerLevel}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      levelSettings: { ...config.levelSettings, challengesPerLevel: Number(e.target.value) }
                    })
                  }
                  className={inputClass}
                >
                  <option value={2}>2 Pos Tantangan</option>
                  <option value={3}>3 Pos Tantangan (Standar)</option>
                  <option value={4}>4 Pos Tantangan</option>
                  <option value={5}>5 Pos Tantangan (Mendalam)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Jumlah Nyawa Pemain
                </label>
                <select
                  value={config.levelSettings.livesCount}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      levelSettings: { ...config.levelSettings, livesCount: Number(e.target.value) }
                    })
                  }
                  className={inputClass}
                >
                  <option value={0}>Tak Terbatas (Ramah PAUD/TK)</option>
                  <option value={3}>3 Nyawa Hati (Standar)</option>
                  <option value={5}>5 Nyawa Hati (Nyaman)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Interval Boss Battle
                </label>
                <select
                  value={config.levelSettings.bossInterval}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      levelSettings: { ...config.levelSettings, bossInterval: Number(e.target.value) }
                    })
                  }
                  className={inputClass}
                >
                  <option value={5}>Setiap 5 Level</option>
                  <option value={10}>Setiap 10 Level</option>
                  <option value={0}>Hanya di Level Terakhir</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <InteractiveLevelMap
                chapters={chaptersPreview}
                sampleLevels={sampleLevelsPreview}
                totalLevels={config.levelSettings.levelCount}
                compact
              />
            </div>
          </div>
        )}

        {/* STEP 7 */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                7. Tinjauan Konfigurasi Game Edukasi
              </h3>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                Periksa kembali konfigurasi game Anda sebelum mengompilasi master prompt 30-seksi untuk Google Gemini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10 space-y-2.5 text-xs">
                <h4 className="font-bold text-[#344E5B] dark:text-[#F7F2E9] text-xs uppercase tracking-wider pb-1.5 border-b border-[#344E5B]/10 dark:border-white/10">
                  Identitas & Materi
                </h4>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Nama Game:</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{config.gameTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Jenjang & Usia:</span>
                  <span className="font-semibold text-[#344E5B] dark:text-[#F7F2E9]">{config.level} ({config.targetAge})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Mata Pelajaran:</span>
                  <span className="font-semibold text-[#344E5B] dark:text-[#F7F2E9]">{config.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Topik Utama:</span>
                  <span className="font-semibold text-[#344E5B] dark:text-[#F7F2E9] text-right truncate max-w-[200px]">{config.mainTopic}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10 space-y-2.5 text-xs">
                <h4 className="font-bold text-[#344E5B] dark:text-[#F7F2E9] text-xs uppercase tracking-wider pb-1.5 border-b border-[#344E5B]/10 dark:border-white/10">
                  Gameplay & Arsitektur
                </h4>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Genre:</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{config.genre}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Total Level:</span>
                  <span className="font-black text-[#E98F7B]">{config.levelSettings.levelCount} Level</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Tema & Gaya:</span>
                  <span className="font-semibold text-[#344E5B] dark:text-[#F7F2E9]">{config.theme} · {config.artStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#344E5B]/70 dark:text-[#A9BCA6]">Mekanisme:</span>
                  <span className="font-semibold text-[#6CAAA4] text-right truncate max-w-[200px]">
                    {config.mechanics.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/10">
              <h4 className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-2">
                Ringkasan Capaian Pembelajaran:
              </h4>
              <p className="text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] leading-relaxed bg-[#F7F2E9] dark:bg-[#1C2D36] p-3 rounded-lg">
                {config.learningObjectives}
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-5 border-t border-[#344E5B]/10 dark:border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] bg-[#F7F2E9] dark:bg-[#131F26] hover:bg-[#A9BCA6]/20 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Kembali' : 'Langkah Sebelumnya'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            {currentStep === 7 ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Prompt Game</span>
              </>
            ) : (
              <>
                <span>Lanjut ke Langkah {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
