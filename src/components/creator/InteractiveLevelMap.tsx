/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LevelChapter, GeneratedLevelPlan } from '../../types/game';
import { Crown, Sparkles, Star, Trophy } from 'lucide-react';

interface InteractiveLevelMapProps {
  chapters: LevelChapter[];
  sampleLevels?: GeneratedLevelPlan[];
  totalLevels: number;
  compact?: boolean;
}

export const InteractiveLevelMap: React.FC<InteractiveLevelMapProps> = ({
  chapters,
  sampleLevels = [],
  totalLevels
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(1);
  const activeChapter = chapters.find((c) => c.chapterIndex === selectedChapterIndex) || chapters[0];

  return (
    <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#344E5B]/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#344E5B] dark:text-[#F7F2E9]">
              Peta Progresi Petualangan ({chapters.length} Babak Dunia)
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#6CAAA4]/20 text-[#344E5B] dark:text-[#84C2BC]">
              Total {totalLevels} Level
            </span>
          </div>
          <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-0.5">
            Sistem level berprogresi bertahap dari fondasi tutorial hingga pertarungan final.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {chapters.map((ch) => {
            const isSelected = ch.chapterIndex === activeChapter.chapterIndex;
            return (
              <button
                key={ch.chapterIndex}
                onClick={() => setSelectedChapterIndex(ch.chapterIndex)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white shadow-2xs'
                    : 'bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B]/80 dark:text-[#A9BCA6] hover:bg-[#A9BCA6]/30 dark:hover:bg-white/10'
                }`}
              >
                Babak {ch.chapterIndex}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter Overview Card */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#F7F2E9] to-[#FFFDF8] dark:from-[#131F26] dark:to-[#1C2D36] border border-[#344E5B]/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E98F7B] uppercase tracking-wider">
                Level {activeChapter.levelRange[0]} – {activeChapter.levelRange[1]}
              </span>
              <span className="text-xs text-[#344E5B]/40 dark:text-white/30">·</span>
              <span className="text-xs font-semibold text-[#6CAAA4]">
                {activeChapter.worldName}
              </span>
            </div>
            <h4 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9] mt-0.5">
              {activeChapter.chapterName}
            </h4>
            <p className="text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] mt-1 leading-relaxed">
              {activeChapter.themeDescription}
            </p>
          </div>

          {activeChapter.bossLevel && (
            <div className="shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#E98F7B]/15 border border-[#E98F7B]/30">
              <Crown className="w-5 h-5 text-[#E98F7B]" />
              <div>
                <span className="text-[10px] font-bold uppercase text-[#D4755F] dark:text-[#F2A492] block">
                  Boss Milestone (Level {activeChapter.bossLevel})
                </span>
                <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                  {activeChapter.bossName || 'Tantangan Puncak'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[#344E5B]/10 dark:border-white/10 flex items-center gap-2 text-xs text-[#344E5B]/80 dark:text-[#D5E2E6]">
          <Sparkles className="w-4 h-4 text-[#6CAAA4] shrink-0" />
          <span>
            <strong>Fokus Pedagogis:</strong> {activeChapter.pedagogicalFocus}
          </span>
        </div>
      </div>

      {/* Visual Level Nodes Track */}
      <div className="mt-5">
        <h5 className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] uppercase tracking-wider mb-3">
          Jalur Level & Tonggak Pencapaian Babak Ini
        </h5>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: activeChapter.levelRange[1] - activeChapter.levelRange[0] + 1 }).map((_, idx) => {
            const currentLevelNum = activeChapter.levelRange[0] + idx;
            const isBoss = currentLevelNum === activeChapter.bossLevel;
            const isFirst = currentLevelNum === 1;
            const isLast = currentLevelNum === totalLevels;

            const sampleDetail = sampleLevels.find((lv) => lv.levelNumber === currentLevelNum);

            return (
              <div
                key={currentLevelNum}
                className={`p-3 rounded-xl border transition-all text-left relative overflow-hidden ${
                  isLast
                    ? 'bg-gradient-to-br from-[#E98F7B]/20 to-[#D9CBEA]/30 dark:from-[#E98F7B]/25 dark:to-[#D9CBEA]/15 border-[#E98F7B]'
                    : isBoss
                    ? 'bg-[#E98F7B]/10 dark:bg-[#E98F7B]/15 border-[#E98F7B]/40'
                    : isFirst
                    ? 'bg-[#A9BCA6]/15 dark:bg-[#6CAAA4]/15 border-[#A9BCA6] dark:border-[#6CAAA4]/40'
                    : 'bg-[#FFFDF8] dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-[#344E5B] dark:text-[#F7F2E9]">
                    Lv. {currentLevelNum}
                  </span>
                  {isLast ? (
                    <Trophy className="w-4 h-4 text-[#E98F7B]" />
                  ) : isBoss ? (
                    <Crown className="w-4 h-4 text-[#E98F7B]" />
                  ) : (
                    <div className="flex items-center text-[#E98F7B]">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-bold text-[#344E5B] dark:text-[#F7F2E9] line-clamp-1">
                  {sampleDetail ? sampleDetail.levelName.replace(/Level \d+: /, '') : isBoss ? 'Pertarungan Boss' : `Pos Ujian ${currentLevelNum}`}
                </div>

                <p className="text-[10px] text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1 line-clamp-2 leading-tight">
                  {sampleDetail?.learningObjective || 'Penguasaan konsep dan pemecahan tantangan bertahap.'}
                </p>

                <div className="mt-2.5 pt-1.5 border-t border-[#344E5B]/10 dark:border-white/10 flex items-center justify-between text-[10px] font-semibold text-[#6CAAA4]">
                  <span>{isBoss ? 'Reward Boss' : '3 Bintang + Koin'}</span>
                  <span className="text-[#344E5B]/60 dark:text-[#A9BCA6]/80 font-mono">
                    {sampleDetail?.difficulty || (isBoss ? 'Boss' : 'Standard')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
