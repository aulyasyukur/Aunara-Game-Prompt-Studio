/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameCharacter } from '../../types/game';
import { StorageService, DEFAULT_CHARACTERS } from '../../services/storage';
import {
  Users2,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
  AlertCircle,
  X
} from 'lucide-react';

interface CharacterStudioProps {
  onSelectForCreator?: (char: GameCharacter) => void;
}

export const CharacterStudio: React.FC<CharacterStudioProps> = () => {
  const [characters, setCharacters] = useState<GameCharacter[]>(() => StorageService.getCharacters());
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<GameCharacter['role']>('Protagonis Utama');
  const [description, setDescription] = useState<string>('');
  const [dominantColor, setDominantColor] = useState<string>('#E98F7B');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const predefinedColors = [
    { name: 'Coral', hex: '#E98F7B' },
    { name: 'Teal', hex: '#6CAAA4' },
    { name: 'Sage', hex: '#A9BCA6' },
    { name: 'Navy', hex: '#344E5B' },
    { name: 'Lavender', hex: '#D9CBEA' },
    { name: 'Gold', hex: '#E5A93C' },
    { name: 'Rose', hex: '#E06B80' },
    { name: 'Sky', hex: '#5899E2' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Ukuran file terlalu besar! Maksimal ukuran gambar adalah 2 MB untuk performa optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImageUrl(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama karakter.');
      return;
    }

    const newChar: GameCharacter = {
      id: 'char-' + Date.now(),
      name: name.trim(),
      role,
      description: description.trim() || 'Karakter pendukung petualangan belajar yang ceria dan penuh rasa ingin tahu.',
      dominantColor,
      imageUrl,
      isCustomUpload: Boolean(imageUrl)
    };

    StorageService.saveCharacter(newChar);
    setCharacters(StorageService.getCharacters());

    setName('');
    setDescription('');
    setImageUrl(undefined);
    setIsAdding(false);
    setErrorMessage(null);
  };

  const handleDelete = (id: string) => {
    if (characters.length <= 1) {
      setErrorMessage('Minimal harus ada 1 karakter di Studio Karakter.');
      return;
    }
    StorageService.deleteCharacter(id);
    setCharacters(StorageService.getCharacters());
  };

  const handleResetDefaults = () => {
    localStorage.setItem('aunara_saved_characters_v1', JSON.stringify(DEFAULT_CHARACTERS));
    setCharacters(DEFAULT_CHARACTERS);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#6CAAA4]/20 text-[#344E5B] dark:text-[#84C2BC]">
                Asset Studio
              </span>
              <span className="text-xs font-semibold text-[#E98F7B]">
                {characters.length} Karakter Tersedia
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#344E5B] dark:text-[#F7F2E9]">
              Karakter Saya
            </h2>
            <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] mt-1 max-w-2xl">
              Kelola karakter game edukasi Anda. Anda dapat mengunggah gambar karakter orisinal, menentukan peran, deskripsi visual, dan warna dominan untuk dipertahankan konsistensinya oleh AI.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F2E9] dark:bg-[#131F26] hover:bg-[#A9BCA6]/30 dark:hover:bg-white/10 text-[#344E5B] dark:text-[#F7F2E9] transition-colors"
              title="Kembalikan maskot bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Maskot</span>
            </button>

            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Karakter Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {characters.map((char) => {
          return (
            <div
              key={char.id}
              className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 hover:border-[#344E5B]/30 dark:hover:border-[#E98F7B]/50 p-5 shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  className="w-full h-36 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden shadow-2xs border border-[#344E5B]/5 dark:border-white/10"
                  style={{ backgroundColor: `${char.dominantColor}22` }}
                >
                  {char.imageUrl ? (
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md"
                      style={{ backgroundColor: char.dominantColor }}
                    >
                      {char.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div
                    className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: char.dominantColor }}
                    title={`Warna Dominan: ${char.dominantColor}`}
                  />
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#344E5B]/10 dark:bg-white/10 text-[#344E5B] dark:text-[#F7F2E9]">
                    {char.role}
                  </span>
                  {char.isCustomUpload && (
                    <span className="text-[10px] font-semibold text-[#6CAAA4]">
                      Upload Pribadi
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-[#344E5B] dark:text-[#F7F2E9] group-hover:text-[#E98F7B] transition-colors line-clamp-1">
                  {char.name}
                </h3>

                <p className="text-xs text-[#344E5B]/75 dark:text-[#D5E2E6] mt-1 line-clamp-3 leading-relaxed">
                  {char.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#344E5B]/10 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#344E5B]/50 dark:text-[#A9BCA6]">
                  {char.dominantColor}
                </span>

                <button
                  onClick={() => handleDelete(char.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-colors"
                  title="Hapus Karakter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Character Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#344E5B]/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl max-w-lg w-full p-6 border border-[#344E5B]/15 dark:border-white/15 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#344E5B]/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[#E98F7B]" />
                <h3 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
                  Tambah Karakter Baru
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setErrorMessage(null);
                }}
                className="p-1 rounded-lg text-[#344E5B]/60 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white hover:bg-[#F7F2E9] dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveNew} className="space-y-4 my-4">
              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Nama Karakter *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Milo si Beruang Cerdas, Kiko si Rubah Cilik"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#344E5B]/20 dark:border-white/15 bg-white dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] focus:outline-none focus:ring-2 focus:ring-[#E98F7B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Peran Karakter dalam Game
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#344E5B]/20 dark:border-white/15 bg-white dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] focus:outline-none focus:ring-2 focus:ring-[#E98F7B]"
                >
                  <option value="Protagonis Utama">Protagonis Utama (Pahlawan yang dimainkan)</option>
                  <option value="Mentor / Guru">Mentor / Guru (Pemberi petunjuk dan ilmu)</option>
                  <option value="Karakter Pendukung">Karakter Pendukung (Sahabat petualangan)</option>
                  <option value="Rival Ramah">Rival Ramah (Pesaing sportif / Penjaga tantangan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Deskripsi Fisik & Sifat Karakter
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Beruang kecil berbulu cokelat lembut memakai kacamata bundar dan rompi hijau. Bersifat sabar, ceria, dan gemar membaca peta."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#344E5B]/20 dark:border-white/15 bg-white dark:bg-[#131F26] text-[#344E5B] dark:text-[#F7F2E9] focus:outline-none focus:ring-2 focus:ring-[#E98F7B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1.5">
                  Warna Dominan Karakter
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {predefinedColors.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setDominantColor(col.hex)}
                      className={`w-7 h-7 rounded-lg border-2 transition-transform ${
                        dominantColor === col.hex ? 'scale-110 border-[#344E5B] dark:border-white shadow-xs' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={dominantColor}
                    onChange={(e) => setDominantColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-[#344E5B]/20 dark:border-white/20 bg-transparent p-0.5"
                    title="Pilih warna custom"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] block mb-1">
                  Upload Gambar Karakter (Opsional, Max 2 MB)
                </label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-[#344E5B]/15 dark:border-white/15 overflow-hidden shrink-0">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl(undefined)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#344E5B]/20 dark:border-white/20 bg-[#F7F2E9]/60 dark:bg-[#131F26] hover:bg-[#F7F2E9] dark:hover:bg-white/5 cursor-pointer text-xs font-semibold text-[#344E5B] dark:text-[#F7F2E9] transition-colors w-full">
                      <Upload className="w-4 h-4 text-[#6CAAA4]" />
                      <span>Pilih Foto dari Perangkat (PNG, JPG, SVG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6] mt-1">
                  Jika gambar diunggah, prompt akan memerintahkan AI mempertahankan kemiripan pakaian dan fitur wajahnya di seluruh level.
                </p>
              </div>

              <div className="pt-3 border-t border-[#344E5B]/10 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#344E5B]/20 dark:border-white/20 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#F7F2E9] dark:hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] shadow-xs"
                >
                  Simpan Karakter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
