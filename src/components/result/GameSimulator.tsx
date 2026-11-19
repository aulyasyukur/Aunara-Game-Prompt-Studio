/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameConfig } from '../../types/game';
import { Heart, Trophy, Star, Volume2, VolumeX, RotateCcw, CheckCircle2, XCircle, ArrowRight, Play } from 'lucide-react';

interface GameSimulatorProps {
  config: GameConfig;
}

export const GameSimulator: React.FC<GameSimulatorProps> = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const playAudio = (type: 'correct' | 'wrong' | 'win') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'correct') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'win') {
        const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        fanfare.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
        });
      }
    } catch {
      // AudioContext muted/unsupported
    }
  };

  const handleStartGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    setCurrentStep(1);
    setSelectedAnswer(null);
    setFeedback('idle');
    setGameWon(false);
  };

  const questions = [
    {
      question: `Selamat datang di Pos Level 1! Untuk materi ${config.mainTopic}, manakah konsep dasar yang paling tepat?`,
      options: [
        `Konsep A: Memahami definisi dan fungsi utama secara runtut dan teratur`,
        `Konsep B: Menghafal tanpa memahami kaitan materi satu sama lain`,
        `Konsep C: Melewatkan dasar dan langsung ke rumus rumit`,
        `Konsep D: Mengabaikan contoh kontekstual di kehidupan sehari-hari`
      ],
      correct: 0,
      explanation: `Tepat sekali! Memahami konsep dasar secara runtut merupakan kunci penguasaan ${config.mainTopic}.`
    },
    {
      question: `Tantangan Pos 2: Mengapa ${config.subtopics.split(',')[0] || config.mainTopic} penting untuk dipelajari?`,
      options: [
        `Karena tidak berhubungan dengan kehidupan sehari-hari`,
        `Karena melatih penalaran kritis dan pemecahan masalah kontekstual`,
        `Hanya untuk menghabiskan waktu luang`,
        `Karena merupakan materi yang tidak perlu dipraktikkan`
      ],
      correct: 1,
      explanation: `Luar biasa! Konsep ini sangat esensial dalam membangun penalaran logis peserta didik.`
    }
  ];

  const currentQ = questions[currentStep - 1] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    if (idx === currentQ.correct) {
      setFeedback('correct');
      setScore((s) => s + 100);
      playAudio('correct');
    } else {
      setFeedback('wrong');
      setLives((l) => Math.max(0, l - 1));
      playAudio('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentStep < questions.length) {
      setCurrentStep((s) => s + 1);
      setSelectedAnswer(null);
      setFeedback('idle');
    } else {
      setGameWon(true);
      playAudio('win');
    }
  };

  const charName = config.characters[0]?.name || 'Pahlawan Cilik';

  return (
    <div className="bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/15 dark:border-white/10 overflow-hidden shadow-sm">
      <div className="bg-[#344E5B] dark:bg-[#131F26] text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E98F7B] flex items-center justify-center font-black text-sm">
            ▶
          </div>
          <div>
            <h4 className="text-xs font-extrabold tracking-wide text-white uppercase">
              Simulator Interaktif Level 1: {config.gameTitle}
            </h4>
            <p className="text-[11px] text-[#A9BCA6]">
              {config.level} · {config.genre} · {config.theme}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleStartGame}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="p-6 min-h-[380px] flex flex-col justify-between bg-gradient-to-b from-[#FFFDF8] via-[#F7F2E9]/60 to-[#F7F2E9] dark:from-[#1C2D36] dark:via-[#17252D] dark:to-[#131F26]">
        {!isPlaying ? (
          <div className="my-auto text-center max-w-md mx-auto py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E98F7B]/15 text-[#E98F7B] mx-auto flex items-center justify-center mb-4 shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#344E5B] dark:text-[#F7F2E9]">
              {config.gameTitle}
            </h3>
            <p className="text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] mt-2 leading-relaxed">
              Uji coba langsung prototipe interaktif Level 1 dari game yang Anda rancang. Coba mekanik gameplay, validasi jawaban, dan efek audio instan!
            </p>

            <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#1C2D36] rounded-xl border border-[#344E5B]/10 dark:border-white/10 text-xs font-semibold text-[#344E5B] dark:text-[#F7F2E9]">
              <span>Karakter Utama: <strong>{charName}</strong></span>
              <span>·</span>
              <span>Jenjang: <strong>{config.level}</strong></span>
            </div>

            <div className="mt-6">
              <button
                onClick={handleStartGame}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#E98F7B] to-[#D4755F] hover:from-[#D4755F] hover:to-[#C0604A] shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Main Level 1</span>
              </button>
            </div>
          </div>
        ) : gameWon ? (
          <div className="my-auto text-center max-w-md mx-auto py-4">
            <div className="w-20 h-20 rounded-full bg-[#A9BCA6]/30 text-[#344E5B] dark:text-[#F7F2E9] mx-auto flex items-center justify-center mb-3">
              <Trophy className="w-10 h-10 text-[#E98F7B]" />
            </div>
            <div className="flex items-center justify-center gap-1 text-[#E98F7B] mb-2">
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-2xl font-black text-[#344E5B] dark:text-[#F7F2E9]">
              Level 1 Selesai!
            </h3>
            <p className="text-xs text-[#344E5B]/80 dark:text-[#D5E2E6] mt-1">
              Selamat! {charName} berhasil memecahkan tantangan pos awal materi <strong>{config.mainTopic}</strong>.
            </p>

            <div className="mt-4 p-3 bg-white dark:bg-[#1C2D36] rounded-xl border border-[#344E5B]/10 dark:border-white/10 max-w-xs mx-auto">
              <div className="flex justify-between text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                <span>Skor Diperoleh:</span>
                <span className="font-mono text-[#E98F7B] font-black">{score} Poin</span>
              </div>
              <div className="flex justify-between text-xs text-[#344E5B]/70 dark:text-[#A9BCA6] mt-1">
                <span>Status Gerbang:</span>
                <span className="text-[#6CAAA4] font-bold">Level 2 Terbuka!</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleStartGame}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-[#344E5B]/20 dark:border-white/20 text-[#344E5B] dark:text-[#F7F2E9] hover:bg-white dark:hover:bg-white/10"
              >
                Main Ulang
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-[#344E5B]/10 dark:border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold text-[#344E5B] dark:text-[#F7F2E9]">
                  Pos Soal {currentStep} / {questions.length}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 ${
                        i < lives ? 'text-[#E98F7B] fill-[#E98F7B]' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#344E5B] dark:text-[#F7F2E9]">
                  Skor: <span className="font-mono text-[#E98F7B]">{score}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6CAAA4]/20 text-[#344E5B] dark:text-[#84C2BC]">
                  {config.mechanics[0] || 'Kuis Interaktif'}
                </span>
              </div>
            </div>

            <div className="my-auto py-4">
              <div className="bg-white dark:bg-[#1C2D36] p-5 rounded-2xl border border-[#344E5B]/10 dark:border-white/10 shadow-2xs">
                <p className="text-sm font-bold text-[#344E5B] dark:text-[#F7F2E9] leading-relaxed">
                  {currentQ.question}
                </p>

                <div className="mt-4 space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === currentQ.correct;

                    let btnStyle =
                      'bg-[#F7F2E9] dark:bg-[#131F26] border-[#344E5B]/10 dark:border-white/10 hover:bg-[#A9BCA6]/20 dark:hover:bg-white/5 text-[#344E5B] dark:text-[#F7F2E9]';
                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isSelected) {
                        btnStyle =
                          'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-900 dark:text-rose-200 font-semibold';
                      } else {
                        btnStyle =
                          'bg-slate-50 dark:bg-[#131F26]/50 border-slate-200 dark:border-white/5 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && (
                          isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 ml-2" />
                          ) : null
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {feedback !== 'idle' && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    feedback === 'correct'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="text-xs">
                    <strong className="block mb-0.5">
                      {feedback === 'correct' ? 'Jawaban Benar! +100 Poin' : 'Belum Tepat, Pelajari Lagi:'}
                    </strong>
                    <span>{currentQ.explanation}</span>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#344E5B] dark:bg-[#E98F7B] hover:bg-[#22343E] dark:hover:bg-[#D4755F] transition-colors"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
