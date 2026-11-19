/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedPrompt, GameCharacter, AuthUser } from '../types/game';

const PROMPTS_STORAGE_KEY = 'aunara_saved_prompts_v1';
const CHARACTERS_STORAGE_KEY = 'aunara_saved_characters_v1';
const AUTH_STORAGE_KEY = 'aunara_auth_session_v1';

export const DEMO_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  displayName: 'Admin Uji Coba',
  role: 'Administrator Studio'
};

export const DEFAULT_CHARACTERS: GameCharacter[] = [
  {
    id: 'char-auna',
    name: 'Auna si Kancil Cerdas',
    role: 'Protagonis Utama',
    description: 'Kancil cilik berompi penjelajah yang cerdik, ramah, dan selalu bersemangat memecahkan teka-teki bersama anak-anak.',
    dominantColor: '#E98F7B',
    isCustomUpload: false
  },
  {
    id: 'char-nara',
    name: 'Nara si Robot Sahabat',
    role: 'Mentor / Guru',
    description: 'Robot pembimbing masa depan yang penyabar, memiliki layar proyektor mini di dada untuk memvisualisasikan konsep sains dan rumus matematika.',
    dominantColor: '#6CAAA4',
    isCustomUpload: false
  },
  {
    id: 'char-pipo',
    name: 'Pipo si Burung Hantu',
    role: 'Karakter Pendukung',
    description: 'Penjaga perpustakaan pohon ajaib berkacamata bulat yang selalu siap membisikkan petunjuk berharga saat pemain merasa buntu.',
    dominantColor: '#A9BCA6',
    isCustomUpload: false
  },
  {
    id: 'char-tara',
    name: 'Tara si Kucing Bintang',
    role: 'Rival Ramah',
    description: 'Kucing astronaut pemberani berekor nebula yang suka menantang pemain berlomba mengumpulkan bintang prestasi secara sportif.',
    dominantColor: '#D9CBEA',
    isCustomUpload: false
  }
];

export const StorageService = {
  // PROMPTS
  getSavedPrompts(): SavedPrompt[] {
    try {
      const data = localStorage.getItem(PROMPTS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as SavedPrompt[];
    } catch (e) {
      console.error('Failed to parse saved prompts', e);
      return [];
    }
  },

  savePrompt(prompt: SavedPrompt): void {
    const list = this.getSavedPrompts();
    const existingIndex = list.findIndex((item) => item.id === prompt.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...prompt, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(prompt);
    }
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(list));
  },

  deletePrompt(id: string): boolean {
    const list = this.getSavedPrompts();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  duplicatePrompt(id: string): SavedPrompt | null {
    const list = this.getSavedPrompts();
    const target = list.find((item) => item.id === id);
    if (!target) return null;

    const copy: SavedPrompt = {
      ...target,
      id: 'prompt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: {
        ...target.summary,
        title: `${target.summary.title} (Salinan)`
      },
      config: {
        ...target.config,
        gameTitle: `${target.config.gameTitle} (Salinan)`
      }
    };

    list.unshift(copy);
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(list));
    return copy;
  },

  // CHARACTERS
  getCharacters(): GameCharacter[] {
    try {
      const data = localStorage.getItem(CHARACTERS_STORAGE_KEY);
      if (!data) {
        // Seed initial characters
        localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(DEFAULT_CHARACTERS));
        return DEFAULT_CHARACTERS;
      }
      return JSON.parse(data) as GameCharacter[];
    } catch (e) {
      console.error('Failed to parse saved characters', e);
      return DEFAULT_CHARACTERS;
    }
  },

  saveCharacter(char: GameCharacter): void {
    const list = this.getCharacters();
    const existingIndex = list.findIndex((c) => c.id === char.id);
    if (existingIndex >= 0) {
      list[existingIndex] = char;
    } else {
      list.push(char);
    }
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(list));
  },

  deleteCharacter(id: string): boolean {
    const list = this.getCharacters();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // AUTH SESSION (Local Admin fallback)
  getAuthUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthUser;
      return {
        ...parsed,
        authProvider: parsed.authProvider || 'local-admin'
      };
    } catch {
      return null;
    }
  },

  loginDemoAdmin(username: string, password: string): { ok: boolean; user?: AuthUser; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      cleanUser === DEMO_ADMIN_CREDENTIALS.username &&
      cleanPass === DEMO_ADMIN_CREDENTIALS.password
    ) {
      const user: AuthUser = {
        username: DEMO_ADMIN_CREDENTIALS.username,
        displayName: DEMO_ADMIN_CREDENTIALS.displayName,
        role: DEMO_ADMIN_CREDENTIALS.role,
        authProvider: 'local-admin',
        loggedInAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch {
        // ignore storage errors
      }
      return { ok: true, user };
    }

    return {
      ok: false,
      error: 'Username atau kata sandi tidak valid. Silakan periksa kembali.'
    };
  },

  logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  // UTILITIES
  downloadAsTxt(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  downloadAsHtml(filename: string, html: string): void {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  }
};
