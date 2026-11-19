/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Plus, Compass, Moon, Sun, LogOut } from 'lucide-react';
import { AunaraLogo } from './AunaraLogo';
import { AuthUser } from '../../types/game';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
  totalSaved: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: AuthUser;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onNavigate,
  activeView,
  totalSaved,
  isDarkMode,
  onToggleDarkMode,
  user,
  onLogout
}) => {
  const viewTitle =
    activeView === 'creator'
      ? 'Buat Game'
      : activeView === 'templates'
      ? 'Template Game'
      : activeView === 'history'
      ? `Prompt Saya (${totalSaved})`
      : activeView === 'characters'
      ? 'Karakter Saya'
      : activeView === 'guide'
      ? 'Panduan & Unduh PDF'
      : activeView === 'about'
      ? 'Tentang AUNARA'
      : activeView === 'result'
      ? 'Hasil Prompt Game'
      : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-8 py-3 bg-[#FFFDF8]/90 dark:bg-[#192830]/90 backdrop-blur-md border-b border-[#344E5B]/10 dark:border-white/10 transition-colors">
      {/* Zone 1: Brand & Menu Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
          className="p-2 rounded-lg text-[#344E5B] dark:text-[#EBF1F3] hover:bg-[#F7F2E9] dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E98F7B]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-left group focus:outline-none whitespace-nowrap shrink-0"
        >
          <AunaraLogo size="md" showWordmark={true} showTagline={true} />
        </button>
      </div>

      {/* Zone 2: Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#344E5B]/70 dark:text-[#A9BCA6]/80">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`hover:text-[#344E5B] dark:hover:text-white transition-colors whitespace-nowrap ${
            activeView === 'dashboard' ? 'text-[#344E5B] dark:text-white font-semibold' : ''
          }`}
        >
          Beranda
        </button>
        <span>/</span>
        <span className="text-[#344E5B] dark:text-white font-semibold whitespace-nowrap">
          {viewTitle}
        </span>
      </div>

      {/* Zone 3: Functional Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap / Malam'}
          title={isDarkMode ? 'Pindah ke Mode Terang' : 'Pindah ke Mode Gelap / Malam'}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#344E5B] dark:text-[#F7F2E9] bg-[#F7F2E9] dark:bg-white/10 hover:bg-[#A9BCA6]/30 dark:hover:bg-white/15 border border-[#344E5B]/10 dark:border-white/10 transition-colors whitespace-nowrap shrink-0"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-300" />
              <span className="hidden xl:inline">Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#344E5B]" />
              <span className="hidden xl:inline">Malam</span>
            </>
          )}
        </button>

        <button
          onClick={() => onNavigate('templates')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'templates'
              ? 'bg-[#6CAAA4] text-white shadow-2xs'
              : 'text-[#344E5B] dark:text-[#EBF1F3] bg-[#6CAAA4]/15 dark:bg-[#6CAAA4]/20 hover:bg-[#6CAAA4]/30'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Template</span>
        </button>

        <button
          onClick={() => onNavigate('creator')}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Buat Game</span>
        </button>

        <button
          onClick={onLogout}
          title={`Keluar (${user.displayName})`}
          aria-label="Keluar"
          className="p-2 rounded-xl text-[#344E5B]/70 dark:text-[#A9BCA6] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-[#344E5B]/10 dark:border-white/10 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
