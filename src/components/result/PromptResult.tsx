/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameConfig, LevelChapter, GeneratedLevelPlan } from '../../types/game';
import { InteractiveLevelMap } from '../creator/InteractiveLevelMap';
import { GameSimulator } from './GameSimulator';
import { GeminiLiveTester } from './GeminiLiveTester';
import { StorageService } from '../../services/storage';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Edit3,
  RotateCcw,
  Bookmark,
  Sparkles,
  Layers,
  Gamepad2,
  FileText,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface PromptResultProps {
  config: GameConfig;
  promptText: string;
  chapters: LevelChapter[];
  sampleLevels: GeneratedLevelPlan[];
  onEditConfig: () => void;
  onRegenerate: () => void;
  onSaveSuccess?: () => void;
}

export const PromptResult: React.FC<PromptResultProps> = ({
  config,
  promptText: initialPromptText,
  chapters,
  sampleLevels,
  onRegenerate,
  onSaveSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'gemini-test' | 'map' | 'simulator'>('prompt');
  const [promptContent, setPromptContent] = useState<string>(initialPromptText);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);

  useEffect(() => {
    setPromptContent(initialPromptText);
  }, [initialPromptText]);

  const handleCopy = async () => {
    const ok = await StorageService.copyToClipboard(promptContent);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadTxt = () => {
    const filename = `AUNARA_Prompt_${config.gameTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${config.level}`;
    StorageService.downloadAsTxt(filename, promptContent);
  };

  const handleSaveToHistory = () => {
    const record = {
      id: 'prompt-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config,
      fullPromptText: promptContent,
      summary: {
        title: config.gameTitle,
        level: config.level,
        subject: config.subject,
        genre: config.genre,
        theme: config.theme,
        totalLevels: config.levelSettings.levelCount
      },
      chapters,
      sampleLevels
    };

    StorageService.savePrompt(record);
    setSaved(true);
    if (onSaveSuccess) onSaveSuccess();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleOpenGemini = async () => {
    await StorageService.copyToClipboard(promptContent);
    setShowGeminiModal(true);
    window.open('https://gemini.google.com/app', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Result Hero Header */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E98F7B]/15 text-[#E98F7B]">
                {config.level}
              </span>
              <span className="text-xs text-[#344E5B]/40 dark:text-white/30">·</span>
              <span className="text-xs font-semibold text-[#344E5B] dark:text-[#F7F2E9]">
                {config.subject}
              </span>
              <span className="text-xs text-[#344E5B]/40 dark:text-white/30">·</span>
              <span className="text-xs font-medium text-[#6CAAA4]">
                {config.levelSettings.levelCount} Level Game
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#344E5B] dark:text-[#F7F2E9]">
              {config.gameTitle}
            </h2>
            <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] mt-1 max-w-2xl">
              Prompt arsitektur game edukasi 30-seksi siap pakai untuk Google Gemini. Dilengkapi kurva progresi bertahap, bank aktivitas, dan mekanisme permainan interaktif.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
              <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] text-[10px] block">Genre</span>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{config.genre}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
              <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] text-[10px] block">Tema Dunia</span>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{config.theme}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
              <span className="text-[#344E5B]/60 dark:text-[#A9BCA6] text-[10px] block">Babak</span>
              <strong className="text-[#344E5B] dark:text-[#F7F2E9]">{chapters.length} Worlds</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 pt-5 border-t border-[#344E5B]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#344E5B] hover:bg-[#22343E] dark:bg-[#6CAAA4] dark:hover:bg-[#589690] text-white shadow-xs'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Prompt'}</span>
            </button>

            <button
              onClick={handleOpenGemini}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] text-white shadow-xs transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buka Gemini</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSaveToHistory}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                saved
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-[#FFFDF8] dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/10 border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-emerald-600 fill-emerald-600' : ''}`} />
              <span>{saved ? 'Tersimpan di Prompt Saya' : 'Simpan ke Prompt Saya'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFFDF8] dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/10 border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh TXT</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isEditing
                  ? 'bg-[#E98F7B]/15 border-[#E98F7B] text-[#D4755F] dark:text-[#F2A492]'
                  : 'bg-[#FFFDF8] dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/10 border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Selesai Edit' : 'Edit Prompt'}</span>
            </button>

            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFFDF8] dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/10 border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] transition-colors"
              title="Generate ulang prompt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Generate Ulang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#344E5B]/10 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'prompt'
              ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white shadow-2xs'
              : 'text-[#344E5B]/70 dark:text-[#A9BCA6] hover:bg-[#FFFDF8] dark:hover:bg-[#1C2D36] hover:text-[#344E5B] dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Teks Prompt Lengkap (30 Seksi)</span>
        </button>

        <button
          onClick={() => setActiveTab('gemini-test')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gemini-test'
              ? 'bg-[#6CAAA4] text-white shadow-2xs'
              : 'text-[#344E5B]/70 dark:text-[#A9BCA6] hover:bg-[#FFFDF8] dark:hover:bg-[#1C2D36] hover:text-[#344E5B] dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Uji Live di Gemini AI</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white shadow-2xs'
              : 'text-[#344E5B]/70 dark:text-[#A9BCA6] hover:bg-[#FFFDF8] dark:hover:bg-[#1C2D36] hover:text-[#344E5B] dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Peta Progresi Level ({config.levelSettings.levelCount} Level)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'simulator'
              ? 'bg-[#E98F7B] text-white shadow-2xs'
              : 'text-[#344E5B]/70 dark:text-[#A9BCA6] hover:bg-[#FFFDF8] dark:hover:bg-[#1C2D36] hover:text-[#344E5B] dark:hover:text-white'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Simulator Level 1</span>
        </button>
      </div>

      {/* Tab 1 */}
      {activeTab === 'prompt' && (
        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#344E5B]/10 dark:border-white/10 text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                {isEditing ? 'Mode Edit Langsung' : 'Pratinjau Prompt Siap Kirim'}
              </span>
              <span>·</span>
              <span className="font-mono">{promptContent.length.toLocaleString()} karakter</span>
            </div>

            {isEditing && (
              <span className="text-[11px] text-[#E98F7B] font-semibold">
                Perubahan Anda disimpan otomatis di sesi ini
              </span>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={promptContent}
              onChange={(e) => setPromptContent(e.target.value)}
              rows={24}
              className="w-full p-4 rounded-xl font-mono text-xs text-[#344E5B] dark:text-[#F7F2E9] bg-[#F7F2E9]/60 dark:bg-[#131F26] border border-[#344E5B]/20 dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-[#E98F7B] leading-relaxed resize-y"
            />
          ) : (
            <div className="relative">
              <pre className="w-full p-5 rounded-xl font-mono text-xs text-[#344E5B] dark:text-[#EBF1F3] bg-[#F7F2E9]/60 dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[650px] overflow-y-auto">
                {promptContent}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Gemini Tester */}
      {activeTab === 'gemini-test' && (
        <GeminiLiveTester config={config} promptText={promptContent} />
      )}

      {/* Tab 3 */}
      {activeTab === 'map' && (
        <InteractiveLevelMap
          chapters={chapters}
          sampleLevels={sampleLevels}
          totalLevels={config.levelSettings.levelCount}
        />
      )}

      {/* Tab 4 */}
      {activeTab === 'simulator' && <GameSimulator config={config} />}

      {/* Modal Instruksi Gemini */}
      {showGeminiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#344E5B]/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl max-w-lg w-full p-6 border border-[#344E5B]/15 dark:border-white/15 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#E98F7B]/15 text-[#E98F7B] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
                  Prompt Berhasil Disalin!
                </h3>
                <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
                  Langkah selanjutnya di Google Gemini
                </p>
              </div>
            </div>

            <div className="bg-[#F7F2E9] dark:bg-[#131F26] rounded-xl p-4 border border-[#344E5B]/10 dark:border-white/10 text-xs text-[#344E5B] dark:text-[#EBF1F3] space-y-2.5 my-4">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#344E5B] dark:bg-[#E98F7B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <p>
                  Tab <strong>Google Gemini</strong> baru saja dibuka di peramban Anda.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#344E5B] dark:bg-[#E98F7B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <p>
                  AUNARA telah <strong>menyalin prompt lengkap secara otomatis</strong> ke clipboard Anda.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#344E5B] dark:bg-[#E98F7B] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <p>
                  Tekan <strong>Ctrl + V</strong> (atau <strong>Cmd + V</strong> di Mac) pada kolom input chat Gemini, lalu tekan Enter untuk menghasilkan game Anda.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#A9BCA6]/20 dark:bg-[#6CAAA4]/15 text-[#344E5B] dark:text-[#EBF1F3] text-[11px] mb-5">
              <AlertCircle className="w-4 h-4 text-[#6CAAA4] shrink-0" />
              <span>
                Catatan: Prompt belum dikirim secara otomatis; Anda perlu menempelkannya (paste) secara manual di Gemini.
              </span>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowGeminiModal(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-[#344E5B] dark:bg-[#E98F7B] hover:bg-[#22343E] dark:hover:bg-[#D4755F] transition-colors"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
