/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification
} from 'firebase/auth';
import {
  auth,
  mapFirebaseUserToAuthUser,
  mapFirebaseAuthError,
  syncUserProfileToFirestore
} from './firebase';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { GameCreator } from './components/creator/GameCreator';
import { TemplateLibrary } from './components/templates/TemplateLibrary';
import { PromptHistory } from './components/history/PromptHistory';
import { CharacterStudio } from './components/characters/CharacterStudio';
import { PromptGuide } from './components/guide/PromptGuide';
import { AboutAunara } from './components/about/AboutAunara';
import { PromptResult } from './components/result/PromptResult';
import { LoginPage } from './components/auth/LoginPage';
import { AunaraLogo } from './components/common/AunaraLogo';
import {
  GameConfig,
  SavedPrompt,
  GeneratedLevelPlan,
  LevelChapter,
  AuthUser
} from './types/game';
import { generateFullPrompt } from './services/promptEngine';
import { StorageService } from './services/storage';
import { MailCheck, X, Loader2 } from 'lucide-react';

export default function App() {
  // Firebase + Local Auth State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => StorageService.getAuthUser());
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [dismissedVerifyBanner, setDismissedVerifyBanner] = useState<boolean>(false);
  const [verifyNotice, setVerifyNotice] = useState<string>('');
  const [verifyBusy, setVerifyBusy] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState<boolean>(false);

  // Dark mode state synced with <html>.dark and localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('aunara_theme_mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('aunara_theme_mode', 'light');
      }
      return next;
    });
  };

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const mapped = mapFirebaseUserToAuthUser(fbUser);
        setAuthUser(mapped);
        if (fbUser.emailVerified) {
          syncUserProfileToFirestore(fbUser).catch((err) => {
            console.error('Gagal sinkronisasi profil pengguna:', err);
          });
        }
      } else {
        // Fall back to local admin session if present
        setAuthUser(StorageService.getAuthUser());
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Storage synced state
  const [prompts, setPrompts] = useState<SavedPrompt[]>(() => StorageService.getSavedPrompts());
  const [characters, setCharacters] = useState(() => StorageService.getCharacters());

  // Result state
  const [generatedData, setGeneratedData] = useState<{
    config: GameConfig;
    promptText: string;
    chapters: LevelChapter[];
    sampleLevels: GeneratedLevelPlan[];
  } | null>(null);

  // Creator preset state
  const [creatorInitialConfig, setCreatorInitialConfig] = useState<Partial<GameConfig> | undefined>(undefined);

  const refreshStorage = () => {
    setPrompts(StorageService.getSavedPrompts());
    setCharacters(StorageService.getCharacters());
  };

  useEffect(() => {
    refreshStorage();
  }, [activeView]);

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setDismissedVerifyBanner(false);
    setVerifyNotice('');
    setActiveView('dashboard');
    refreshStorage();
  };

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (err) {
      console.error('Gagal keluar dari Firebase Auth:', err);
    }
    StorageService.logout();
    setAuthUser(null);
    setActiveView('dashboard');
    setIsMobileSidebarOpen(false);
  };

  const handleResendVerification = async () => {
    const current = auth.currentUser;
    if (!current || verifyBusy) return;
    setVerifyBusy(true);
    setVerifyNotice('');
    try {
      await sendEmailVerification(current);
      setVerifyNotice('Email verifikasi telah dikirim ulang. Periksa kotak masuk atau folder spam Anda.');
    } catch (err) {
      setVerifyNotice(mapFirebaseAuthError(err));
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleCheckVerified = async () => {
    const current = auth.currentUser;
    if (!current || verifyBusy) return;
    setVerifyBusy(true);
    setVerifyNotice('');
    try {
      await current.reload();
      if (auth.currentUser?.emailVerified) {
        await syncUserProfileToFirestore(auth.currentUser).catch(() => {});
        setAuthUser(mapFirebaseUserToAuthUser(auth.currentUser));
      } else {
        setVerifyNotice('Email belum terverifikasi. Klik tautan verifikasi pada email Anda lalu coba lagi.');
      }
    } catch (err) {
      setVerifyNotice(mapFirebaseAuthError(err));
    } finally {
      setVerifyBusy(false);
    }
  };

  // Auth initializing state
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] dark:bg-[#131F26] flex flex-col items-center justify-center gap-4 text-[#344E5B] dark:text-[#EBF1F3]">
        <AunaraLogo size="md" showWordmark={true} showTagline={true} />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#344E5B]/70 dark:text-[#A9BCA6]">
          <Loader2 className="w-4 h-4 animate-spin text-[#6CAAA4]" />
          <span>Menyiapkan sesi studio...</span>
        </div>
      </div>
    );
  }

  // Render Login Page when not signed in
  if (!authUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  // Handler: When user generates prompt in Creator
  const handleGenerate = (config: GameConfig) => {
    const result = generateFullPrompt(config);

    const savedRecord: SavedPrompt = {
      id: 'prompt-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config,
      fullPromptText: result.promptText,
      summary: {
        title: config.gameTitle,
        level: config.level,
        subject: config.subject,
        genre: config.genre,
        theme: config.theme,
        totalLevels: config.levelSettings.levelCount
      },
      chapters: result.chapters,
      sampleLevels: result.sampleLevels
    };

    StorageService.savePrompt(savedRecord);
    refreshStorage();

    setGeneratedData({
      config,
      promptText: result.promptText,
      chapters: result.chapters,
      sampleLevels: result.sampleLevels
    });

    setActiveView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPrompt = (saved: SavedPrompt) => {
    setGeneratedData({
      config: saved.config,
      promptText: saved.fullPromptText,
      chapters: saved.chapters,
      sampleLevels: saved.sampleLevels
    });
    setActiveView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditInCreator = (saved: SavedPrompt) => {
    setCreatorInitialConfig(saved.config);
    setActiveView('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseTemplate = (config: GameConfig) => {
    setCreatorInitialConfig(config);
    setActiveView('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setCreatorInitialConfig(undefined);
    setActiveView('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    if (view === 'creator') handleCreateNew();
    else setActiveView(view);
  };

  const showEmailVerifyBanner =
    authUser.authProvider === 'firebase-email' &&
    authUser.emailVerified === false &&
    !dismissedVerifyBanner;

  return (
    <div className="min-h-screen bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#EBF1F3] flex flex-col font-sans selection:bg-[#E98F7B]/30 selection:text-[#344E5B] dark:selection:text-white transition-colors">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onNavigate={handleNavigate}
        activeView={activeView}
        totalSaved={prompts.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        user={authUser}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex">
        {/* Collapsible / Responsive Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isCollapsedDesktop}
          onToggleCollapse={() => setIsCollapsedDesktop(!isCollapsedDesktop)}
          totalPrompts={prompts.length}
          totalCharacters={characters.length}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          user={authUser}
          onLogout={handleLogout}
        />

        {/* Main Content Viewport */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 ${
            isCollapsedDesktop ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          {showEmailVerifyBanner && (
            <div className="mb-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#1C2D36] border border-[#6CAAA4]/35 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6CAAA4]/15 text-[#6CAAA4] flex items-center justify-center shrink-0">
                  <MailCheck className="w-4 h-4" />
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                    Verifikasi alamat email Anda ({authUser.email})
                  </p>
                  <p className="text-[#344E5B]/70 dark:text-[#A9BCA6] mt-0.5">
                    Klik tautan verifikasi yang kami kirim ke email Anda untuk mengaktifkan sinkronisasi profil cloud.
                  </p>
                  {verifyNotice && (
                    <p className="mt-1.5 font-semibold text-[#6CAAA4]">{verifyNotice}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  disabled={verifyBusy}
                  onClick={handleCheckVerified}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#6CAAA4] text-white hover:bg-[#52918B] transition-colors disabled:opacity-60"
                >
                  Saya Sudah Verifikasi
                </button>
                <button
                  type="button"
                  disabled={verifyBusy}
                  onClick={handleResendVerification}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#F7F2E9] dark:bg-white/10 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-[#A9BCA6]/25 transition-colors disabled:opacity-60"
                >
                  Kirim Ulang
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedVerifyBanner(true)}
                  aria-label="Tutup pemberitahuan"
                  className="p-1.5 rounded-lg text-[#344E5B]/55 dark:text-[#A9BCA6] hover:bg-[#F7F2E9] dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeView === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenPrompt={handleOpenPrompt}
              onUseTemplate={handleUseTemplate}
              prompts={prompts}
              characterCount={characters.length}
            />
          )}

          {activeView === 'creator' && (
            <GameCreator
              initialConfig={creatorInitialConfig}
              onGenerate={handleGenerate}
              onCancel={() => setActiveView('dashboard')}
            />
          )}

          {activeView === 'templates' && (
            <TemplateLibrary onUseTemplate={handleUseTemplate} />
          )}

          {activeView === 'history' && (
            <PromptHistory
              onOpenPrompt={handleOpenPrompt}
              onEditInCreator={handleEditInCreator}
              onCreateNew={handleCreateNew}
            />
          )}

          {activeView === 'characters' && (
            <CharacterStudio
              onSelectForCreator={() => {
                handleCreateNew();
              }}
            />
          )}

          {activeView === 'guide' && <PromptGuide />}

          {activeView === 'about' && <AboutAunara />}

          {activeView === 'result' && generatedData && (
            <PromptResult
              config={generatedData.config}
              promptText={generatedData.promptText}
              chapters={generatedData.chapters}
              sampleLevels={generatedData.sampleLevels}
              onEditConfig={() => {
                setCreatorInitialConfig(generatedData.config);
                setActiveView('creator');
              }}
              onRegenerate={() => {
                handleGenerate(generatedData.config);
              }}
              onSaveSuccess={refreshStorage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
