/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Gamepad2,
  BookTemplate,
  FileCode,
  Users2,
  BookOpen,
  Info,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  UserCheck
} from 'lucide-react';
import { AunaraLogo } from './AunaraLogo';
import { AuthUser } from '../../types/game';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  totalPrompts: number;
  totalCharacters: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: AuthUser;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  isOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  totalPrompts,
  totalCharacters,
  isDarkMode,
  onToggleDarkMode,
  user,
  onLogout
}) => {

  const menuGroups: Array<{ title: string; items: MenuItem[] }> = [
    {
      title: 'Workspace Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'creator', label: 'Buat Game', icon: Gamepad2, badge: null },
        { id: 'templates', label: 'Template Game', icon: BookTemplate, badge: '65+' }
      ]
    },
    {
      title: 'Koleksi Studio',
      items: [
        {
          id: 'history',
          label: 'Prompt Saya',
          icon: FileCode,
          badge: totalPrompts > 0 ? totalPrompts.toString() : null
        },
        {
          id: 'characters',
          label: 'Karakter Saya',
          icon: Users2,
          badge: totalCharacters > 0 ? totalCharacters.toString() : null
        }
      ]
    },
    {
      title: 'Bantuan & Informasi',
      items: [
        { id: 'guide', label: 'Panduan & PDF', icon: BookOpen, badge: null },
        { id: 'about', label: 'Tentang AUNARA', icon: Info, badge: null }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#344E5B]/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-20 bg-[#FFFDF8] dark:bg-[#192830] border-r border-[#344E5B]/10 dark:border-white/10 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Top Header + Navigation */}
        <div className="overflow-y-auto flex-1">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#344E5B]/10 dark:border-white/10">
            {!isCollapsed ? (
              <AunaraLogo size="sm" showWordmark={true} showTagline={true} />
            ) : (
              <div className="mx-auto">
                <AunaraLogo size="sm" showWordmark={false} />
              </div>
            )}

            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg text-[#344E5B]/60 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white hover:bg-[#F7F2E9] dark:hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Grouped Functional Navigation */}
          <nav className="p-3 space-y-4">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#344E5B]/45 dark:text-[#A9BCA6]/60">
                    {group.title}
                  </div>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#344E5B] dark:bg-[#E98F7B] text-white shadow-xs'
                          : 'text-[#344E5B]/80 dark:text-[#EBF1F3]/80 hover:bg-[#F7F2E9] dark:hover:bg-white/10 hover:text-[#344E5B] dark:hover:text-white'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-[#E98F7B] dark:text-white'
                            : 'text-[#344E5B]/70 dark:text-[#A9BCA6]'
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between text-left">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#344E5B]/8 dark:bg-white/10 text-[#344E5B] dark:text-[#F7F2E9]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Utility & Account Footer */}
        <div className="p-3 border-t border-[#344E5B]/10 dark:border-white/10 space-y-2">
          <button
            onClick={onToggleDarkMode}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F2E9] dark:bg-white/5 hover:bg-[#A9BCA6]/25 dark:hover:bg-white/10 text-[#344E5B] dark:text-[#F7F2E9] transition-colors ${
              isCollapsed ? 'justify-center px-0' : 'justify-between'
            }`}
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap / Malam'}
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-[#344E5B] shrink-0" />
              )}
              {!isCollapsed && <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#344E5B]/10 dark:bg-white/10">
                {isDarkMode ? 'ON' : 'OFF'}
              </span>
            )}
          </button>

          {/* Logged-in User Profile + Logout */}
          <div
            className={`rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/8 dark:border-white/10 p-2.5 flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between gap-2'
            }`}
          >
            {!isCollapsed && (
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#344E5B]/15 dark:border-white/15"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#6CAAA4]/20 text-[#6CAAA4] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#344E5B] dark:text-[#F7F2E9] truncate">
                    {user.displayName}
                  </p>
                  <p className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] truncate">
                    {user.email || `@${user.username}`}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              title="Keluar dari akun"
              aria-label="Keluar dari akun"
              className="p-2 rounded-lg text-[#344E5B]/70 dark:text-[#A9BCA6] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
