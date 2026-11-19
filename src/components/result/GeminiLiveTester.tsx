/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameConfig } from '../../types/game';
import {
  Sparkles,
  Play,
  RotateCcw,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Code2,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Square
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface QaCheckItem {
  id: string;
  label: string;
  passed: boolean;
  detail?: string;
}

interface TestResultData {
  html: string;
  elapsedMs: number;
  rawLength: number;
  htmlLength: number;
  qa: {
    passedCount: number;
    totalCount: number;
    allPassed: boolean;
    checks: QaCheckItem[];
  };
}

interface GeminiLiveTesterProps {
  config: GameConfig;
  promptText: string;
}

export const GeminiLiveTester: React.FC<GeminiLiveTesterProps> = ({
  config,
  promptText
}) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [streamChars, setStreamChars] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [result, setResult] = useState<TestResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSource, setShowSource] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const nativeFsActiveRef = useRef<boolean>(false);

  const enterFullscreen = useCallback(() => {
    setShowSource(false);
    setIsFullscreen(true);
    const el = previewContainerRef.current;
    if (el && typeof el.requestFullscreen === 'function') {
      el.requestFullscreen()
        .then(() => {
          nativeFsActiveRef.current = true;
        })
        .catch(() => {
          // Fallback to full-viewport overlay if host iframe blocks native Fullscreen API
          nativeFsActiveRef.current = false;
        });
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
      nativeFsActiveRef.current = false;
      document.exitFullscreen().catch(() => {
        // ignore exit errors
      });
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && nativeFsActiveRef.current) {
        nativeFsActiveRef.current = false;
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, exitFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  const runLiveTest = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('running');
    setStatusMessage('Menghubungkan ke Gemini AI & mengirim Master Prompt...');
    setStreamChars(0);
    setElapsedMs(0);
    setErrorMsg('');
    setShowSource(false);

    try {
      const response = await fetch('/api/test-prompt-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          expectedLevels: config.levelSettings.levelCount,
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        let serverErr = `Server mengembalikan status ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.error) serverErr = errJson.error;
        } catch {
          // ignore JSON parse failure
        }
        throw new Error(serverErr);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Browser tidak mendukung pembacaan stream dari server.');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let gotResult = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;

          const payload = JSON.parse(jsonStr);
          if (payload.type === 'status') {
            setStatusMessage(payload.message || 'Memproses prompt di Gemini AI...');
          } else if (payload.type === 'progress') {
            setStreamChars(payload.chars || 0);
            setElapsedMs(payload.elapsedMs || 0);
            setStatusMessage('Gemini sedang menulis kode game HTML5 interaktif...');
          } else if (payload.type === 'result') {
            gotResult = true;
            setResult({
              html: payload.html,
              elapsedMs: payload.elapsedMs,
              rawLength: payload.rawLength,
              htmlLength: payload.htmlLength,
              qa: payload.qa
            });
            setElapsedMs(payload.elapsedMs || 0);
            setIframeKey((k) => k + 1);
            setStatus('success');
          } else if (payload.type === 'error') {
            throw new Error(payload.error || 'Terjadi kesalahan saat menguji prompt.');
          }
        }
      }

      if (!gotResult) {
        throw new Error('Koneksi selesai sebelum game berhasil diterima dari Gemini AI.');
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatus(result ? 'success' : 'idle');
        return;
      }
      const message = err instanceof Error ? err.message : 'Gagal menjalankan uji prompt.';
      setErrorMsg(message);
      setStatus('error');
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleDownloadHtml = () => {
    if (!result?.html) return;
    const safeName = config.gameTitle.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'AUNARA_Game';
    const blob = new Blob([result.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeName}_${config.level}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    if (!result?.html) return;
    const ok = await StorageService.copyToClipboard(result.html);
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Control & Overview Card */}
      <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#6CAAA4] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi Langsung & Pratinjau Playable</span>
            </div>
            <h3 className="text-lg font-black text-[#344E5B] dark:text-[#F7F2E9]">
              Uji Master Prompt Langsung di Gemini AI
            </h3>
            <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] max-w-2xl leading-relaxed">
              Kirim prompt aktif Anda langsung ke mesin Gemini AI untuk memastikan prompt menghasilkan game HTML5 yang utuh, bebas galat sintaksis JavaScript, dan langsung dapat dimainkan sesuai spesifikasi <strong>{config.level} · {config.subject} ({config.levelSettings.levelCount} Level)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {status === 'running' ? (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#344E5B]/10 dark:bg-white/10 hover:bg-[#344E5B]/20 dark:hover:bg-white/20 text-[#344E5B] dark:text-[#F7F2E9] transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Batalkan</span>
              </button>
            ) : (
              <button
                onClick={runLiveTest}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6CAAA4] hover:bg-[#589690] text-white shadow-xs transition-all active:scale-[0.98]"
              >
                {status === 'success' ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Uji Ulang di Gemini AI</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bangun & Uji Game Sekarang</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live Progress Indicator */}
        {status === 'running' && (
          <div className="mt-5 p-4 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/10 dark:border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 font-semibold text-[#344E5B] dark:text-[#F7F2E9]">
                <Loader2 className="w-4 h-4 text-[#E98F7B] animate-spin" />
                <span>{statusMessage}</span>
              </div>
              <div className="flex items-center gap-4 font-mono tabular-nums text-[11px] text-[#344E5B]/70 dark:text-[#A9BCA6]">
                <span>{streamChars.toLocaleString('id-ID')} karakter</span>
                <span>{(elapsedMs / 1000).toFixed(1)} dtk</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-[#344E5B]/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6CAAA4] via-[#E98F7B] to-[#6CAAA4] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(96, Math.max(8, Math.round((streamChars / 45000) * 100)))}%`
                }}
              />
            </div>
            <p className="text-[11px] text-[#344E5B]/65 dark:text-[#A9BCA6]">
              Proses ini biasanya memakan waktu 30–80 detik karena Gemini membangun seluruh antarmuka, ilustrasi SVG, audio Web Audio API, dan sistem {config.levelSettings.levelCount} level dalam satu file HTML5 utuh.
            </p>
          </div>
        )}

        {/* Error Banner */}
        {status === 'error' && (
          <div className="mt-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-red-900 dark:text-red-200">Pengujian Gemini Belum Berhasil</p>
              <p className="text-red-800/90 dark:text-red-300/90 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results: QA Checklist + Playable Iframe */}
      {result && (
        <>
          {/* QA Audit Summary */}
          <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#344E5B]/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    result.qa.allPassed
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {result.qa.allPassed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9] tabular-nums">
                    Hasil Audit Otomatis: {result.qa.passedCount} / {result.qa.totalCount} Kriteria Lulus
                  </h4>
                  <p className="text-xs text-[#344E5B]/70 dark:text-[#A9BCA6]">
                    {result.qa.allPassed
                      ? 'Semua standar teknis & pedagogis AUNARA terpenuhi. Game siap dimainkan dan diunduh.'
                      : 'Game berhasil dibangun. Periksa catatan di bawah jika ingin menyempurnakan prompt.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs tabular-nums">
                <div className="px-3 py-1.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
                  <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] block">Ukuran HTML</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">
                    {(result.htmlLength / 1024).toFixed(1)} KB
                  </strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#F7F2E9] dark:bg-[#131F26] border border-[#344E5B]/5 dark:border-white/10">
                  <span className="text-[10px] text-[#344E5B]/60 dark:text-[#A9BCA6] block">Waktu Build</span>
                  <strong className="text-[#344E5B] dark:text-[#F7F2E9]">
                    {(result.elapsedMs / 1000).toFixed(1)} detik
                  </strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {result.qa.checks.map((check) => (
                <div
                  key={check.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    check.passed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-500/25'
                      : 'bg-red-50/70 dark:bg-red-950/25 border-red-200/80 dark:border-red-500/30'
                  }`}
                >
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[#344E5B] dark:text-[#F7F2E9] leading-snug">
                      {check.label}
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        check.passed
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {check.passed ? 'Lulus' : 'Gagal'}
                      {check.detail ? ` — ${check.detail}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Playable Game Sandbox */}
          <div
            ref={previewContainerRef}
            className={
              isFullscreen
                ? 'fixed inset-0 z-[100] w-screen h-screen flex flex-col bg-[#FFFDF8] dark:bg-[#131F26]'
                : 'bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/10 dark:border-white/10 overflow-hidden shadow-xs'
            }
          >
            <div className="shrink-0 px-5 py-3 bg-[#F7F2E9] dark:bg-[#131F26] border-b border-[#344E5B]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Play className="w-4 h-4 text-[#E98F7B] fill-[#E98F7B] shrink-0" />
                <span className="text-xs font-black text-[#344E5B] dark:text-[#F7F2E9] truncate">
                  Pratinjau Game Hasil Gemini AI — {config.gameTitle}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#FFFDF8] dark:bg-[#1C2D36] hover:bg-white dark:hover:bg-white/10 border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Game</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                    isFullscreen
                      ? 'bg-[#E98F7B] hover:bg-[#D4755F] text-white'
                      : 'bg-[#FFFDF8] dark:bg-[#1C2D36] hover:bg-white dark:hover:bg-white/10 border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9]'
                  }`}
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'Keluar Fullscreen (ESC)' : 'Layar Penuh'}</span>
                </button>

                {!isFullscreen && (
                  <button
                    onClick={() => setShowSource((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#FFFDF8] dark:bg-[#1C2D36] hover:bg-white dark:hover:bg-white/10 border border-[#344E5B]/15 dark:border-white/15 text-[#344E5B] dark:text-[#F7F2E9] transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{showSource ? 'Tutup Kode' : 'Kode HTML'}</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadHtml}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#344E5B] hover:bg-[#22343E] dark:bg-[#E98F7B] dark:hover:bg-[#D4755F] text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Game (.html)</span>
                </button>
              </div>
            </div>

            <div className={isFullscreen ? 'flex-1 min-h-0 bg-white' : 'bg-white'}>
              <iframe
                key={iframeKey}
                title={`Pratinjau Game Gemini: ${config.gameTitle}`}
                srcDoc={result.html}
                sandbox="allow-scripts allow-same-origin"
                allow="fullscreen"
                className={
                  isFullscreen
                    ? 'w-full h-full border-0 block'
                    : 'w-full h-[620px] border-0 block'
                }
              />
            </div>

            {showSource && !isFullscreen && (
              <div className="p-4 border-t border-[#344E5B]/10 dark:border-white/10 bg-[#F7F2E9]/70 dark:bg-[#131F26]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                    Kode Sumber HTML5 Tunggal Hasil Gemini AI
                  </span>
                  <button
                    onClick={handleCopyHtml}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-[#344E5B] text-white hover:bg-[#22343E] transition-colors"
                  >
                    {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHtml ? 'HTML Tersalin!' : 'Salin HTML'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#0D161B] border border-[#344E5B]/10 dark:border-white/10 font-mono text-[11px] text-[#344E5B] dark:text-[#EBF1F3] overflow-x-auto max-h-96 overflow-y-auto whitespace-pre">
                  {result.html}
                </pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
