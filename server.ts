/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GAME_SANDBOX_SYSTEM_INSTRUCTION = `Anda adalah Senior Educational Game Developer.
Saat pengguna meminta Anda membuatkan game edukasi, wujudkan seluruh spesifikasi game tersebut menjadi SATU file HTML5 tunggal yang 100% utuh dan langsung dapat dimainkan di browser/iframe (dimulai dari <!DOCTYPE html> hingga </html>), dengan CSS (<style>), ilustrasi inline SVG, Web Audio API sintetis, dan Vanilla JavaScript (<script>) yang bebas syntax error.
Aturan teknis sandbox:
- Bungkus semua akses localStorage di dalam try { ... } catch (e) {} dengan fallback memori.
- Jangan gunakan window.alert(), window.confirm(), window.prompt(), atau URL gambar/audio eksternal.
- Jangan pernah menulis komentar TODO atau memotong level; pastikan seluruh level yang diminta aktif dan berisi materi pelajaran otentik.
- Keluarkan HANYA satu blok kode \`\`\`html ... \`\`\` yang lengkap tanpa penjelasan panjang di luar blok kode.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'aunara-studio' });
  });

  // Live Gemini Prompt-to-Game Test & QA Verification Endpoint
  app.post('/api/test-prompt-game', async (req, res) => {
    const { promptText, expectedLevels, stream = true } = req.body as {
      promptText?: string;
      expectedLevels?: number;
      stream?: boolean;
    };

    if (!promptText || typeof promptText !== 'string' || promptText.trim().length < 50) {
      res.status(400).json({ error: 'Prompt tidak valid atau terlalu pendek untuk diuji.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Kunci API Gemini belum terkonfigurasi di server. Silakan periksa panel Settings > Secrets.',
      });
      return;
    }

    const extractAndAuditGame = (raw: string, elapsedMs: number) => {
      const fenced = raw.match(/```(?:html)?\s*(<!DOCTYPE html[\s\S]*?<\/html>)\s*```/i);
      const rawDoc = raw.match(/(<!DOCTYPE html[\s\S]*<\/html>)/i);
      const html = (fenced?.[1] || rawDoc?.[1] || '').trim();

      const scriptMatches = [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)];
      const combinedJs = scriptMatches.map((m) => m[1]).join('\n;\n');

      let jsSyntaxValid = false;
      let jsSyntaxError = '';
      if (scriptMatches.length > 0 && combinedJs.trim().length > 0) {
        try {
          // Syntax-only validation without executing the script
          new Function(combinedJs);
          jsSyntaxValid = true;
        } catch (e: unknown) {
          jsSyntaxError = e instanceof Error ? e.message : String(e);
        }
      } else {
        jsSyntaxError = 'Tidak ditemukan tag <script> berisi logika JavaScript.';
      }

      const checks = [
        {
          id: 'complete_html',
          label: 'Struktur HTML5 Utuh (<!DOCTYPE html> hingga </html>)',
          passed: /<!DOCTYPE html>/i.test(html) && /<\/html>\s*$/i.test(html),
        },
        {
          id: 'js_syntax',
          label: 'Validasi Sintaksis JavaScript (Bebas Syntax Error)',
          passed: jsSyntaxValid,
          detail: jsSyntaxError || `${scriptMatches.length} blok skrip valid`,
        },
        {
          id: 'main_menu',
          label: 'Main Menu & Tombol Mulai Interaktif',
          passed: /Mulai|Petualangan|Start|Play/i.test(html) && /<button/i.test(html),
        },
        {
          id: 'level_system',
          label: `Peta Level & Progresi (${expectedLevels || 'Multi'} Level)`,
          passed: /Peta|Level|Babak|World/i.test(html) && /unlock|buka|terbuka|stars|bintang/i.test(html),
        },
        {
          id: 'scoring_rewards',
          label: 'Sistem Skor, Bintang & Umpan Balik Edukatif',
          passed: /skor|score/i.test(html) && /bintang|star/i.test(html),
        },
        {
          id: 'web_audio',
          label: 'Audio Sintetis Web Audio API (Offline)',
          passed: /AudioContext|webkitAudioContext/.test(html),
        },
        {
          id: 'safe_storage',
          label: 'Penyimpanan Progres Aman (try/catch localStorage)',
          passed: /try\s*\{[\s\S]*?localStorage/i.test(html),
        },
        {
          id: 'boss_and_ending',
          label: 'Boss Battle & Layar Laporan Belajar / Kemenangan',
          passed: /boss/i.test(html) && /laporan|report|menang|victory|selamat|tamat/i.test(html),
        },
        {
          id: 'clean_no_stub',
          label: 'Tanpa Placeholder TODO, window.alert(), atau URL Gambar Rusak',
          passed:
            !/\bTODO\b|tambahkan level \d|Contoh soal level/i.test(html) &&
            !/\bwindow\.alert\s*\(/i.test(html) &&
            !/https?:\/\/(images\.unsplash|picsum\.photos|via\.placeholder)/i.test(html),
        },
      ];

      const passedCount = checks.filter((c) => c.passed).length;
      return {
        html,
        elapsedMs,
        rawLength: raw.length,
        htmlLength: html.length,
        qa: {
          passedCount,
          totalCount: checks.length,
          allPassed: passedCount === checks.length,
          checks,
        },
      };
    };

    const t0 = Date.now();

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const sendEvent = (payload: Record<string, unknown>) => {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      };

      try {
        sendEvent({ type: 'status', message: 'Mengirim Master Prompt AUNARA ke Gemini AI...' });

        const streamResponse = await ai.models.generateContentStream({
          model: 'gemini-4-hydrogen',
          contents: promptText,
          config: {
            systemInstruction: GAME_SANDBOX_SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        let fullText = '';
        let lastProgressAt = 0;

        for await (const chunk of streamResponse) {
          if (chunk.text) {
            fullText += chunk.text;
            const now = Date.now();
            if (now - lastProgressAt > 250) {
              lastProgressAt = now;
              sendEvent({
                type: 'progress',
                chars: fullText.length,
                elapsedMs: now - t0,
              });
            }
          }
        }

        const result = extractAndAuditGame(fullText, Date.now() - t0);
        if (!result.html) {
          sendEvent({
            type: 'error',
            error: 'Gemini tidak mengembalikan blok HTML utuh. Coba klik "Uji Ulang" atau pastikan instruksi single-file HTML aktif.',
          });
          res.end();
          return;
        }

        sendEvent({ type: 'result', ...result });
        res.end();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal menguji prompt ke Gemini AI.';
        console.error('Gemini Prompt Test Error:', err);
        let friendlyError = message;
        if (message.includes('403') || message.includes('400') || message.includes('API_KEY')) {
          friendlyError = 'Gagal otentikasi Gemini API. Pastikan API key valid di panel Settings > Secrets.';
        } else if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
          friendlyError = 'Batas kuota permintaan AI tercapai sementara. Silakan tunggu beberapa saat lalu coba lagi.';
        }
        sendEvent({ type: 'error', error: friendlyError });
        res.end();
      }
      return;
    }

    // Non-streaming JSON mode
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptText,
        config: {
          systemInstruction: GAME_SANDBOX_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      const result = extractAndAuditGame(response.text || '', Date.now() - t0);
      res.json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menguji prompt ke Gemini AI.';
      res.status(500).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AUNARA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AUNARA server:', err);
  process.exit(1);
});
