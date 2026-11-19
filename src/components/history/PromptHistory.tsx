/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SavedPrompt } from '../../types/game';
import { StorageService } from '../../services/storage';
import {
  Search,
  Copy,
  Check,
  Download,
  Trash2,
  CopyPlus,
  Edit3,
  ExternalLink,
  Calendar,
  FileCode,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface PromptHistoryProps {
  onOpenPrompt: (prompt: SavedPrompt) => void;
  onEditInCreator: (prompt: SavedPrompt) => void;
  onCreateNew: () => void;
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({
  onOpenPrompt,
  onEditInCreator,
  onCreateNew
}) => {
  const [prompts, setPrompts] = useState<SavedPrompt[]>(() => StorageService.getSavedPrompts());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('SEMUA');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<SavedPrompt | null>(null);

  const levels = ['SEMUA', 'PAUD', 'TK', 'SD', 'SMP', 'SMA'];

  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      if (selectedLevel !== 'SEMUA' && item.config.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.summary.title.toLowerCase().includes(q);
        const matchSubject = item.summary.subject.toLowerCase().includes(q);
        const matchTopic = item.config.mainTopic.toLowerCase().includes(q);
        return matchTitle || matchSubject || matchTopic;
      }
      return true;
    });
  }, [prompts, selectedLevel, searchQuery]);

  const handleCopy = async (id: string, text: string) => {
    const ok = await StorageService.copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleDuplicate = (id: string) => {
    const copy = StorageService.duplicatePrompt(id);
    if (copy) {
      setPrompts(StorageService.getSavedPrompts());
    }
  };

  const handleDeleteConfirm = () => {
    if (!promptToDelete) return;
    StorageService.deletePrompt(promptToDelete.id);
    setPrompts(StorageService.getSavedPrompts());
    setPromptToDelete(null);
  };

  const handleDownloadTxt = (item: SavedPrompt) => {
    const filename = `AUNARA_${item.summary.title.replace(/[^a-zA-Z0-9]/g, '_')}_${item.summary.level}`;
    StorageService.downloadAsTxt(filename, item.fullPromptText);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E98F7B]/15 text-[#E98F7B]">
                Penyimpanan Lokal
              </span>
              <span className="text-xs font-semibold text-[#344E5B] dark:text-[#A9BCA6]">
                {prompts.length} Prompt Tersimpan
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#344E5B] dark:text-[#F7F2E9]">
              Prompt Saya
            </h2>
            <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] mt-1 max-w-2xl">
              Seluruh riwayat prompt game edukasi yang Anda buat tersimpan aman di peramban ini. Anda dapat menyalin, menduplikasi, mengedit, atau mengunduhnya kapan saja.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[#344E5B]/40 dark:text-[#A9BCA6] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul prompt, materi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/45 dark:placeholder:text-[#A9BCA6]/60 focus:outline-none focus:ring-2 focus:ring-[#E98F7B]"
            />
          </div>
        </div>

        {prompts.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#344E5B]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {levels.map((lvl) => {
                const isSelected = selectedLevel === lvl;
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
                    {lvl}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-[#344E5B]/60 dark:text-[#A9BCA6] font-medium">
              Menampilkan <strong>{filteredPrompts.length}</strong> dari {prompts.length} prompt
            </div>
          </div>
        )}
      </div>

      {/* Prompts List / Empty State */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#E98F7B]/15 text-[#E98F7B] mx-auto flex items-center justify-center mb-4">
            <FileCode className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#344E5B] dark:text-[#F7F2E9]">
            {prompts.length === 0 ? 'Belum Ada Prompt Tersimpan' : 'Prompt Tidak Ditemukan'}
          </h3>
          <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] mt-1.5 leading-relaxed">
            {prompts.length === 0
              ? 'Anda belum merancang prompt game edukasi. Mulai sekarang menggunakan Smart Game Creator atau pilih dari 65+ template siap pakai!'
              : 'Tidak ada prompt yang cocok dengan kata kunci atau filter yang Anda pilih.'}
          </p>

          <div className="mt-6">
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] shadow-sm active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buat Game Pertama Anda</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((item) => {
            const isCopied = copiedId === item.id;
            const dateStr = new Date(item.updatedAt || item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-[#E98F7B]/50 p-5 shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E98F7B]/15 text-[#E98F7B]">
                        {item.summary.level}
                      </span>
                      <span className="text-xs text-[#344E5B]/40 dark:text-white/30">·</span>
                      <span className="text-xs font-semibold text-[#6CAAA4]">
                        {item.summary.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#344E5B]/50 dark:text-[#A9BCA6] font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onOpenPrompt(item)}
                    className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9] group-hover:text-[#E98F7B] transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.summary.title}
                  </h3>

                  <p className="text-xs text-[#344E5B]/75 dark:text-[#D5E2E6] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.config.learningObjectives || item.config.mainTopic}
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#344E5B]/70 dark:text-[#D5E2E6]">
                    <span className="px-2 py-0.5 rounded-md bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
                      {item.summary.genre}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
                      {item.summary.theme}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E98F7B]/10 text-[#E98F7B] font-bold">
                      {item.summary.totalLevels} Level
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#344E5B]/10 dark:border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.id, item.fullPromptText)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#A9BCA6]/30 dark:hover:bg-white/10'
                      }`}
                      title={isCopied ? 'Tersalin!' : 'Salin Prompt'}
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDownloadTxt(item)}
                      className="p-2 rounded-xl text-xs font-semibold bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#A9BCA6]/30 dark:hover:bg-white/10 transition-colors"
                      title="Unduh file .txt"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(item.id)}
                      className="p-2 rounded-xl text-xs font-semibold bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#A9BCA6]/30 dark:hover:bg-white/10 transition-colors"
                      title="Duplikasi Prompt"
                    >
                      <CopyPlus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setPromptToDelete(item)}
                      className="p-2 rounded-xl text-xs font-semibold bg-[#F7F2E9] dark:bg-[#131F26] text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                      title="Hapus Prompt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditInCreator(item)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#F7F2E9] dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onOpenPrompt(item)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#344E5B] dark:bg-[#E98F7B] hover:bg-[#22343E] dark:hover:bg-[#D4755F] text-white shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <span>Buka</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {promptToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#344E5B]/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl max-w-md w-full p-6 border border-[#344E5B]/15 dark:border-white/15 shadow-xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
                  Hapus Prompt Ini?
                </h3>
                <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] my-4 leading-relaxed bg-[#F7F2E9] dark:bg-[#131F26] p-3 rounded-xl">
              Apakah Anda yakin ingin menghapus arsip prompt <strong>"{promptToDelete.summary.title}"</strong> dari penyimpanan lokal Anda?
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setPromptToDelete(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-[#344E5B]/20 dark:border-white/20 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#F7F2E9] dark:hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Ya, Hapus Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
