/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthUser } from '../types/game';

const SESSION_TOKEN_KEY = 'aunara_session_token_v1';

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string): void {
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // ignore storage quota errors
  }
}

function clearStoredToken(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export const AuthApi = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = getStoredToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers
      });
      if (!res.ok) {
        clearStoredToken();
        return null;
      }
      const data = (await res.json()) as { user?: AuthUser | null };
      return data.user || null;
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = (await res.json()) as { user?: AuthUser; token?: string; error?: string };
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error || 'Email atau kata sandi tidak valid.' };
      }
      if (data.token) {
        setStoredToken(data.token);
      }
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: 'Tidak dapat terhubung ke server autentikasi. Silakan coba lagi.' };
    }
  },

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = (await res.json()) as { user?: AuthUser; token?: string; error?: string };
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error || 'Gagal mendaftarkan akun baru.' };
      }
      if (data.token) {
        setStoredToken(data.token);
      }
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: 'Tidak dapat terhubung ke server autentikasi. Silakan coba lagi.' };
    }
  },

  async logout(): Promise<void> {
    clearStoredToken();
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // ignore network errors on logout
    }
  }
};
