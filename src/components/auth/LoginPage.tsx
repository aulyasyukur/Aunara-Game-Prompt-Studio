/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import {
  auth,
  mapFirebaseUserToAuthUser,
  mapFirebaseAuthError,
  syncUserProfileToFirestore
} from '../../firebase';
import { AunaraLogo } from '../common/AunaraLogo';
import { StorageService } from '../../services/storage';
import { AuthUser } from '../../types/game';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Gamepad2,
  FileCode,
  BookOpen,
  Moon,
  Sun,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

type AuthTab = 'login' | 'register';

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Login fields
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Register fields
  const [fullName, setFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim();
    if (!cleanId || !password.trim()) {
      setError('Mohon masukkan email atau username serta kata sandi terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (cleanId.includes('@')) {
        const cred = await signInWithEmailAndPassword(auth, cleanId, password);
        syncUserProfileToFirestore(cred.user).catch((syncErr) => {
          console.error('Gagal menyinkronkan profil:', syncErr);
        });
        onLoginSuccess(mapFirebaseUserToAuthUser(cred.user));
      } else {
        const res = StorageService.loginDemoAdmin(cleanId, password);
        if (res.ok && res.user) {
          onLoginSuccess(res.user);
        } else {
          setError(res.error || 'Email/username atau kata sandi tidak valid.');
        }
      }
    } catch (err) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = fullName.trim();
    const cleanEmail = regEmail.trim();

    if (!cleanName) {
      setError('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, regPassword);
      await updateProfile(cred.user, { displayName: cleanName }).catch(() => {});
      await sendEmailVerification(cred.user).catch(() => {});
      onLoginSuccess(mapFirebaseUserToAuthUser(cred.user, cleanName));
    } catch (err) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting;

  return (
    <div className="min-h-screen bg-[#F7F2E9] dark:bg-[#131F26] text-[#344E5B] dark:text-[#EBF1F3] flex flex-col justify-between transition-colors">
      {/* Top Bar */}
      <header className="w-full max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
        <AunaraLogo size="md" showWordmark={true} showTagline={true} />

        <button
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? 'Pindah ke Mode Terang' : 'Pindah ke Mode Gelap'}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFFDF8] dark:bg-[#1C2D36] border border-[#344E5B]/10 dark:border-white/10 text-[#344E5B] dark:text-[#F7F2E9] hover:border-[#E98F7B]/50 transition-colors"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-300" />
              <span>Mode Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#344E5B]" />
              <span>Mode Malam</span>
            </>
          )}
        </button>
      </header>

      {/* Main Centered Split Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-3xl border border-[#344E5B]/10 dark:border-white/10 shadow-lg overflow-hidden">
          {/* Left Side: Product Functional Overview */}
          <div className="lg:col-span-6 p-7 sm:p-10 bg-gradient-to-br from-[#344E5B] via-[#2B4350] to-[#1F343E] text-[#FFFDF8] flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#E98F7B] mb-2">
                AI Educational Game Prompt Studio
              </p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                Rancang, Uji, dan Mainkan Game Edukasi dalam Satu Studio
              </h1>
              <p className="text-xs sm:text-sm text-[#D5E2E6] mt-3 leading-relaxed">
                Dirancang khusus untuk guru, orang tua, dan kreator pendidikan agar bisa menyusun game pembelajaran interaktif jenjang PAUD hingga SMA secara cepat dan terstruktur.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 text-[#E98F7B] flex items-center justify-center shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">Smart Game Creator 7 Langkah</h3>
                    <p className="text-[11px] text-[#C2D4DA] mt-0.5 leading-relaxed">
                      Susun kurikulum, mekanisme, karakter, dan progresi 5–50 level yang siap dijalankan langsung di Google Gemini.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 text-[#6CAAA4] flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">Uji Live & Pratinjau Fullscreen di Gemini AI</h3>
                    <p className="text-[11px] text-[#C2D4DA] mt-0.5 leading-relaxed">
                      Uji hasil prompt langsung ke Gemini AI, mainkan pratinjau game dalam mode layar penuh, dan unduh file HTML5 siap pakai.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 text-[#A9BCA6] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">65+ Template & Panduan PDF</h3>
                    <p className="text-[11px] text-[#C2D4DA] mt-0.5 leading-relaxed">
                      Lengkap dengan panduan pedagogis praktis yang dapat diunduh sebagai buku saku PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 text-[11px] text-[#A9BCA6] flex items-center justify-between">
              <span>AUNARA Game Prompt Studio V.1.0</span>
              <span>Create • Play • Learn</span>
            </div>
          </div>

          {/* Right Side: Login & Register Tabs */}
          <div className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-center">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10 mb-6">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => switchTab('login')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-[#FFFDF8] dark:bg-[#1C2D36] text-[#344E5B] dark:text-[#F7F2E9] shadow-xs'
                    : 'text-[#344E5B]/65 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => switchTab('register')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-[#FFFDF8] dark:bg-[#1C2D36] text-[#344E5B] dark:text-[#F7F2E9] shadow-xs'
                    : 'text-[#344E5B]/65 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white'
                }`}
              >
                Daftar Akun
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-[#344E5B] dark:text-[#F7F2E9]">
                {activeTab === 'login' ? 'Masuk ke Studio AUNARA' : 'Buat Akun Baru'}
              </h2>
              <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1.5 leading-relaxed">
                {activeTab === 'login'
                  ? 'Masukkan alamat email atau username beserta kata sandi Anda untuk mengakses studio.'
                  : 'Daftarkan akun baru dengan alamat email Anda untuk mulai merancang game edukasi.'}
              </p>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-identifier"
                    className="block text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1.5"
                  >
                    Email atau Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#344E5B]/45 dark:text-[#A9BCA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-identifier"
                      type="text"
                      autoComplete="username"
                      disabled={isBusy}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Masukkan email atau username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/40 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#6CAAA4] disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1.5"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#344E5B]/45 dark:text-[#A9BCA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      disabled={isBusy}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/40 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#6CAAA4] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#344E5B]/55 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] shadow-sm transition-all active:scale-[0.99] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Memproses...' : 'Masuk'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="reg-fullname"
                    className="block text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1.5"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#344E5B]/45 dark:text-[#A9BCA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-fullname"
                      type="text"
                      autoComplete="name"
                      disabled={isBusy}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/40 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#6CAAA4] disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1.5"
                  >
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#344E5B]/45 dark:text-[#A9BCA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      disabled={isBusy}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/40 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#6CAAA4] disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1.5"
                    >
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#344E5B]/45 dark:text-[#A9BCA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={isBusy}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 karakter"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/40 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#6CAAA4] disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((v) => !v)}
                        aria-label={showRegPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#344E5B]/55 dark:text-[#A9BCA6] hover:text-[#344E5B] dark:hover:text-white"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-confirm-password"
                      className="block text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9] mb-1.5"
                    >
                      Konfirmasi Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#344E5B]/45 dark:text-[#A9BCA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-confirm-password"
                        type={showRegPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={isBusy}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm bg-[#F7F2E9]/70 dark:bg-[#131F26] border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] placeholder:text-[#344E5B]/40 dark:placeholder:text-[#A9BCA6]/50 focus:outline-none focus:ring-2 focus:ring-[#6CAAA4] disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6CAAA4] to-[#52918B] hover:from-[#52918B] hover:to-[#427A74] shadow-sm transition-all active:scale-[0.99] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar dengan Email'}</span>
                </button>
              </form>
            )}

            <p className="mt-5 text-center text-[11px] text-[#344E5B]/65 dark:text-[#A9BCA6]">
              {activeTab === 'login' ? (
                <>
                  Belum memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('register')}
                    className="font-bold text-[#6CAAA4] hover:underline"
                  >
                    Daftar dengan email
                  </button>
                </>
              ) : (
                <>
                  Sudah memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="font-bold text-[#E98F7B] hover:underline"
                  >
                    Masuk di sini
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-[11px] text-[#344E5B]/60 dark:text-[#A9BCA6]">
        AUNARA — AI Educational Game Prompt Studio
      </footer>
    </div>
  );
};
