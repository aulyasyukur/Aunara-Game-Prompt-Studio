/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthApi } from './services/authApi';
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
import { Loader2 } from 'lucide-react';

export default function App() {
  // Server-Side Session Auth State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);

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

  // Restore verified session from backend on mount
  useEffect(() => {
    let active = true;
    AuthApi.getCurrentUser()
      .then((user) => {
        if (active) {
          setAuthUser(user);
          setAuthReady(true);
        }
      })
      .catch(() => {
        if (active) {
          setAuthUser(null);
          setAuthReady(true);
        }
      });

    return () => {
      active = false;
    };
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
    setActiveView('dashboard');
    refreshStorage();
  };

  const handleLogout = async () => {
    await AuthApi.logout();
    setAuthUser(null);
    setActiveView('dashboard');
    setIsMobileSidebarOpen(false);
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
