/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameConfig, LevelChapter, GeneratedLevelPlan } from '../types/game';
import { EDUCATION_LEVELS } from '../data/subjects';

export function calculateChapters(totalLevels: number, themeName: string): LevelChapter[] {
  if (totalLevels <= 5) {
    return [
      {
        chapterIndex: 1,
        chapterName: 'Babak 1: Gerbang Awal Petualangan',
        worldName: `Lembah Pembuka ${themeName}`,
        levelRange: [1, Math.min(2, totalLevels)],
        themeDescription: 'Pengenalan antarmuka, tutorial navigasi, dan konsep dasar materi.',
        pedagogicalFocus: 'Mengingat & Memahami konsep dasar (C1–C2).'
      },
      {
        chapterIndex: 2,
        chapterName: 'Babak 2: Tantangan Inti & Puncak Kemenangan',
        worldName: `Kuil Kebijaksanaan ${themeName}`,
        levelRange: [Math.min(3, totalLevels), totalLevels],
        themeDescription: 'Penerapan konsep materi secara mendalam dengan tantangan terpadu hingga ujian akhir.',
        pedagogicalFocus: 'Menerapkan & Menganalisis pemecahan masalah (C3–C4).',
        bossLevel: totalLevels,
        bossName: `Penjaga Kuil Utama ${themeName}`
      }
    ];
  }

  if (totalLevels <= 10) {
    return [
      {
        chapterIndex: 1,
        chapterName: 'Babak 1: Langkah Awal Penjelajah',
        worldName: `Desa Pemula ${themeName}`,
        levelRange: [1, 3],
        themeDescription: 'Tutorial interaktif, pengenalan kontrol, dan pemahaman konsep dasar.',
        pedagogicalFocus: 'Pengenalan konsep dan stimulasi motivasi awal (C1).'
      },
      {
        chapterIndex: 2,
        chapterName: 'Babak 2: Eksplorasi Lembah Rahasia',
        worldName: `Lembah Misteri ${themeName}`,
        levelRange: [4, 7],
        themeDescription: 'Variasi rintangan baru, kombinasi dua konsep materi, dan pengumpulan koin pengetahuan.',
        pedagogicalFocus: 'Aplikasi konsep dalam situasi beragam (C2–C3).',
        bossLevel: 7,
        bossName: `Raksasa Penjaga Lembah`
      },
      {
        chapterIndex: 3,
        chapterName: 'Babak 3: Puncak Menara Kebijaksanaan',
        worldName: `Benteng Puncak ${themeName}`,
        levelRange: [8, totalLevels],
        themeDescription: 'Tantangan evaluasi komprehensif, batasan waktu terukur, dan pertarungan final.',
        pedagogicalFocus: 'Sintesis dan evaluasi materi secara mandiri (C4–C5).',
        bossLevel: totalLevels,
        bossName: `Sang Penguasa Ujian Terakhir`
      }
    ];
  }

  if (totalLevels <= 20) {
    return [
      {
        chapterIndex: 1,
        chapterName: 'Babak 1: Dunia Pemula (Beginner Realm)',
        worldName: `Taman Pengetahuan ${themeName}`,
        levelRange: [1, 4],
        themeDescription: 'Pengenalan mekanik, konsep dasar bertahap, dan membangun rasa percaya diri pemain.',
        pedagogicalFocus: 'Mengingat & Memahami (C1–C2).'
      },
      {
        chapterIndex: 2,
        chapterName: 'Babak 2: Hutan Eksplorasi (Exploration Realm)',
        worldName: `Hutan Kristal ${themeName}`,
        levelRange: [5, 9],
        themeDescription: 'Materi diperluas dengan teka-teki logika bercabang dan mini-boss pertama.',
        pedagogicalFocus: 'Menerapkan konsep ke kasus baru (C3).',
        bossLevel: 9,
        bossName: `Penjaga Gerbang Kristal`
      },
      {
        chapterIndex: 3,
        chapterName: 'Babak 3: Lembah Tantangan (Challenge Realm)',
        worldName: `Lembah Badai ${themeName}`,
        levelRange: [10, 15],
        themeDescription: 'Tantangan berjangka waktu, kombinasi multi-mekanisme, dan materi tingkat menengah.',
        pedagogicalFocus: 'Menganalisis hubungan sebab-akibat (C4).',
        bossLevel: 15,
        bossName: `Komandan Badai Logika`
      },
      {
        chapterIndex: 4,
        chapterName: 'Babak 4: Puncak Penguasaan (Mastery Realm)',
        worldName: `Kastil Inti Bintang ${themeName}`,
        levelRange: [16, totalLevels],
        themeDescription: 'Soal pemecahan masalah kritis, boss fight bertahap, dan selebrasi wisuda akhir.',
        pedagogicalFocus: 'Evaluasi & Kreasi Solusi (C5–C6).',
        bossLevel: totalLevels,
        bossName: `Master Arkais Penguasa Alam ${themeName}`
      }
    ];
  }

  // 30 or more levels
  const part1 = Math.round(totalLevels * 0.17);
  const part2 = Math.round(totalLevels * 0.4);
  const part3 = Math.round(totalLevels * 0.67);
  const part4 = Math.round(totalLevels * 0.9);

  return [
    {
      chapterIndex: 1,
      chapterName: 'Babak 1: Dunia Pemula (Beginner World)',
      worldName: `Lembah Fajar ${themeName}`,
      levelRange: [1, part1],
      themeDescription: 'Pengenalan fondasi, antarmuka intuitif, dan pemahaman materi esensial tanpa tekanan.',
      pedagogicalFocus: 'Pondasi pemahaman awal & adaptasi antarmuka permainan (C1).',
      bossLevel: part1,
      bossName: `Penjaga Fajar Pengetahuan`
    },
    {
      chapterIndex: 2,
      chapterName: 'Babak 2: Dunia Eksplorasi (Exploration World)',
      worldName: `Gua Kristal & Hutan Lebat ${themeName}`,
      levelRange: [part1 + 1, part2],
      themeDescription: 'Eksplorasi konsep materi baru secara variatif, pengumpulan artefak ilmu, dan rintangan dinamis.',
      pedagogicalFocus: 'Penerapan konsep pada situasi beragam (C2–C3).',
      bossLevel: part2,
      bossName: `Raksasa Kristal Penjaga Rahasia`
    },
    {
      chapterIndex: 3,
      chapterName: 'Babak 3: Dunia Tantangan (Challenge World)',
      worldName: `Ngarai Angin & Menara Jam ${themeName}`,
      levelRange: [part2 + 1, part3],
      themeDescription: 'Tantangan logika bertingkat, batas waktu terukur, dan soal bernalar lebih dalam.',
      pedagogicalFocus: 'Analisis kritis dan penalaran terstruktur (C4).',
      bossLevel: part3,
      bossName: `Wali Ngarai Penguji Ketepatan`
    },
    {
      chapterIndex: 4,
      chapterName: 'Babak 4: Dunia Mahir (Advanced World)',
      worldName: `Kota Cahaya Terapung ${themeName}`,
      levelRange: [part3 + 1, part4],
      themeDescription: 'Studi kasus kompleks, integrasi antar materi, dan mekanisme teka-teki tingkat lanjut.',
      pedagogicalFocus: 'Evaluasi mendalam dan sintesis konsep (C5).',
      bossLevel: part4,
      bossName: `Ksatria Penjaga Mahkota Kebijaksanaan`
    },
    {
      chapterIndex: 5,
      chapterName: 'Babak 5: Persiapan Ujian Akhir (Final Preparation)',
      worldName: `Jalan Bintang Abadi`,
      levelRange: [part4 + 1, totalLevels - 1],
      themeDescription: 'Review cepat seluruh materi dari babak awal hingga akhir dengan tantangan kombo cepat.',
      pedagogicalFocus: 'Retensi memori jangka panjang & penguatan materi menyeluruh (C5–C6).'
    },
    {
      chapterIndex: 6,
      chapterName: 'Babak 6: Puncak Pertarungan Agung (Final Boss Realm)',
      worldName: `Arsip Kebijaksanaan Kosmik`,
      levelRange: [totalLevels, totalLevels],
      themeDescription: 'Pertarungan boss pamungkas multi-fase melawan monster kebodohan dengan jurus ilmu pengetahuan!',
      pedagogicalFocus: 'Puncak pembuktian kompetensi holistik seluruh materi (C6).',
      bossLevel: totalLevels,
      bossName: `Sang Bayangan Kebodohan & Penguji Agung`
    }
  ];
}

export function generateSampleLevels(config: GameConfig, chapters: LevelChapter[]): GeneratedLevelPlan[] {
  const levels: GeneratedLevelPlan[] = [];
  const totalLevels = config.levelSettings.levelCount;

  const subtopicList = config.subtopics
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const milestoneNumbers = new Set<number>();
  milestoneNumbers.add(1);
  if (totalLevels >= 2) milestoneNumbers.add(2);
  if (totalLevels >= 5) milestoneNumbers.add(Math.ceil(totalLevels * 0.3));
  if (totalLevels >= 10) milestoneNumbers.add(Math.ceil(totalLevels * 0.5));
  if (totalLevels >= 15) milestoneNumbers.add(Math.ceil(totalLevels * 0.75));
  milestoneNumbers.add(totalLevels);

  const charLead = config.characters[0]?.name || 'Pahlawan Cilik';
  const charMentor = config.characters[1]?.name || 'Guru Pembimbing';

  chapters.forEach((chapter) => {
    const start = chapter.levelRange[0];
    const end = chapter.levelRange[1];

    for (let i = start; i <= end; i++) {
      if (milestoneNumbers.has(i) || levels.length < 5) {
        const isFirst = i === 1;
        const isFinal = i === totalLevels;
        const isBoss = i === chapter.bossLevel;
        const focusedSubtopic = subtopicList[(i - 1) % Math.max(1, subtopicList.length)] || config.mainTopic;

        let diff: GeneratedLevelPlan['difficulty'] = 'Mudah';
        if (isFinal || isBoss) diff = 'Master / Boss';
        else if (i > totalLevels * 0.6) diff = 'Menantang';
        else if (i > totalLevels * 0.3) diff = 'Sedang';

        const activeMechanic = config.mechanics[(i - 1) % Math.max(1, config.mechanics.length)] || 'Multiple Choice';

        levels.push({
          levelNumber: i,
          levelName: isFirst
            ? `Level 1: Langkah Perdana di ${chapter.worldName}`
            : isFinal
            ? `Level ${i}: Puncak Kemenangan — ${chapter.bossName || 'Tantangan Akhir'}`
            : isBoss
            ? `Level ${i}: Ujian Babak — ${chapter.bossName || 'Boss Gerbang'}`
            : `Level ${i}: Eksplorasi ${focusedSubtopic}`,
          worldName: chapter.worldName,
          shortStory: isFirst
            ? `${charLead} memulai perjalanan di ${chapter.worldName} bersama ${charMentor} untuk membuka gerbang pertama ${focusedSubtopic}.`
            : isFinal
            ? `Pertarungan pamungkas! ${charLead} menyatukan seluruh ilmu ${config.mainTopic} untuk mengalahkan ${chapter.bossName || 'Boss Akhir'} dan menyalakan Mercusuar Kebijaksanaan.`
            : `${charLead} tiba di pos tantangan baru yang menguji pemahaman tentang ${focusedSubtopic}.`,
          learningObjective: isFirst
            ? `Mengenal dan mempraktikkan dasar ${focusedSubtopic} sesuai jenjang ${config.level}.`
            : isFinal
            ? `Menguasai seluruh kompetensi: ${config.targetCompetencies}.`
            : `Menerapkan konsep ${focusedSubtopic} dalam pemecahan tantangan ${activeMechanic}.`,
          mainMission: isFirst
            ? `Selesaikan ${config.levelSettings.questionsPerLevel} pos pengenalan dan raih bintang pertamamu.`
            : isFinal
            ? `Kalahkan ${chapter.bossName || 'Boss Akhir'} dalam pertempuran multi-fase hingga HP Boss mencapai 0!`
            : `Tuntaskan ${config.levelSettings.questionsPerLevel} tantangan ${activeMechanic} untuk membuka Level ${i + 1}.`,
          uniqueChallenge: isFirst
            ? `Mode Tutorial interaktif menggunakan mekanisme ${activeMechanic} dengan panduan langkah demi langkah.`
            : isFinal
            ? `Boss Battle multi-fase dengan Health Bar Boss dan kombinasi ${config.mechanics.slice(0, 2).join(' + ')}.`
            : `Tantangan interaktif ${activeMechanic} berfokus pada ${focusedSubtopic} (tingkat ${diff}).`,
          topicMaterial: focusedSubtopic,
          sampleActivity: `Aktivitas ${activeMechanic} dengan materi nyata tentang ${focusedSubtopic} sesuai kurikulum ${config.level}.`,
          sampleQuestion: `[WAJIB DIISI SOAL NYATA OLEH AI] Susun ${config.levelSettings.questionsPerLevel} soal/aktivitas otentik jenjang ${config.level} bertema ${focusedSubtopic} (hindari teks placeholder).`,
          sampleAnswer: `[WAJIB DIISI KUNCI VALID OLEH AI] Kunci jawaban akurat sesuai materi ${focusedSubtopic}.`,
          answerExplanation: `[WAJIB DIISI PENJELASAN RAMAH ANAK] Penjelasan singkat mengapa jawaban tersebut benar agar siswa belajar dari setiap langkah.`,
          difficulty: diff,
          reward: isFinal ? 'Piala Kejuaraan Emas + Sertifikat Kelulusan + Gelar Master' : isBoss ? 'Medali Babak + 100 Koin Ilmu' : '1–3 Bintang + 25 Koin Ilmu',
          clearRequirement: isFinal ? 'Kalahkan seluruh fase Boss dengan akurasi minimal 75%' : 'Selesaikan seluruh tantangan pos dengan minimal 1 bintang',
          unlockNextCondition: isFinal ? 'Game Tamat & Layar Laporan Belajar Terbuka' : `Raih minimal 1 Bintang di Level ${i}`
        });
      }
    }
  });

  return levels;
}

export function generateFullPrompt(config: GameConfig): {
  promptText: string;
  chapters: LevelChapter[];
  sampleLevels: GeneratedLevelPlan[];
} {
  const meta = EDUCATION_LEVELS[config.level];
  const chapters = calculateChapters(config.levelSettings.levelCount, config.theme);
  const sampleLevels = generateSampleLevels(config, chapters);
  const totalLevels = config.levelSettings.levelCount;
  const effectiveSubject = config.subject === 'CUSTOM' && config.customSubject ? config.customSubject : config.subject;
  const effectiveTheme = config.theme === 'CUSTOM' && config.customTheme ? config.customTheme : config.theme;
  const effectiveGenre = config.genre === 'CUSTOM' && config.customGenre ? config.customGenre : config.genre;
  const effectiveAge = config.level === 'CUSTOM' && config.customAgeRange ? config.customAgeRange : config.targetAge || meta.defaultAge;

  const charLead = config.characters.find((c) => c.role === 'Protagonis Utama') || config.characters[0] || {
    name: 'Auna',
    role: 'Protagonis Utama',
    description: 'Pahlawan cilik penjelajah yang cerdik dan ramah.',
    dominantColor: '#E98F7B'
  };

  const charMentor = config.characters.find((c) => c.role === 'Mentor / Guru') || config.characters[1] || {
    name: 'Nara',
    role: 'Mentor / Guru',
    description: 'Pembimbing bijak yang memberikan petunjuk materi ramah anak.',
    dominantColor: '#6CAAA4'
  };

  const hasUploadedCharacter = config.characters.some((c) => c.isCustomUpload);

  const charListString = config.characters.length > 0
    ? config.characters
        .map(
          (c, i) =>
            `   ${i + 1}. **${c.name}** (${c.role}): ${c.description} — Warna Dominan: \`${c.dominantColor}\`${
              c.isCustomUpload ? ' [Karakter Kustom Pengguna: pertahankan identitas visual, warna, dan ciri fisiknya secara konsisten di semua level]' : ''
            }`
        )
        .join('\n')
    : `   1. **${charLead.name}** (Protagonis Utama): ${charLead.description} (Warna: \`${charLead.dominantColor}\`)\n   2. **${charMentor.name}** (Mentor): ${charMentor.description} (Warna: \`${charMentor.dominantColor}\`)`;

  const chaptersBreakdownString = chapters
    .map((ch) => {
      return `   - **${ch.chapterName}** (Level ${ch.levelRange[0]}–${ch.levelRange[1]})
     * Dunia / Lokasi: ${ch.worldName}
     * Deskripsi Atmosfer: ${ch.themeDescription}
     * Fokus Pedagogis: ${ch.pedagogicalFocus}
     ${ch.bossLevel ? `* Boss Milestone: Level ${ch.bossLevel} (${ch.bossName})` : '* Pintu Evaluasi Mandiri'}`;
    })
    .join('\n');

  const sampleLevelsString = sampleLevels
    .map((lv) => {
      return `#### [Level ${lv.levelNumber}: ${lv.levelName}]
- **Lokasi & Dunia**: ${lv.worldName} | **Kesulitan**: ${lv.difficulty}
- **Cerita Singkat**: ${lv.shortStory}
- **Tujuan Pembelajaran**: ${lv.learningObjective}
- **Misi Utama**: ${lv.mainMission}
- **Tantangan Unik**: ${lv.uniqueChallenge}
- **Materi Fokus**: ${lv.topicMaterial}
- **Reward**: ${lv.reward}
- **Syarat Lulus & Unlock**: ${lv.clearRequirement} → ${lv.unlockNextCondition}`;
    })
    .join('\n\n');

  const storageKey = `game_progress_${config.gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32)}`;
  const bossLevelsList = chapters.map((c) => c.bossLevel).filter(Boolean).join(', ') || String(totalLevels);

  const promptText = `Buatkan game edukasi interaktif yang lengkap, seru, dan langsung dapat dimainkan berjudul "${config.gameTitle}" untuk jenjang ${config.level} (${effectiveAge}) mata pelajaran ${effectiveSubject} dengan total ${totalLevels} level berjenjang.

---

## 1. PERAN & KETENTUAN UTAMA PEMBUATAN GAME
Bertindaklah sebagai **Lead Educational Game Designer & Senior Interactive Game Developer**. Tugas Anda adalah langsung membuatkan game edukasi **"${config.gameTitle}"** yang **100% utuh, langsung dapat dimainkan secara interaktif, bebas error, dan tanpa teks placeholder**.

> **ATURAN WAJIB PEMBUATAN GAME**:
> 1. **LANGSUNG SIAP DIMAINKAN**: Bangun game secara utuh dan mandiri agar pemain bisa langsung menekan tombol **Mulai**, memilih level, menjawab tantangan, mendengar efek suara, dan melihat hasil belajar tanpa perlu instalasi atau aset eksternal tambahan.
> 2. **VISUAL & AUDIO MANDIRI**: Jangan bergantung pada tautan gambar atau file MP3 eksternal yang berisiko rusak. Buat seluruh ilustrasi karakter, latar tema, ikon, animasi, serta efek suara langsung terintegrasi di dalam game.
> 3. **SEMUA ${totalLevels} LEVEL BENAR-BENAR AKTIF**: Dilarang memotong level atau menulis catatan seperti "tambahkan level berikutnya sendiri". Pastikan seluruh Level 1 hingga Level ${totalLevels} memiliki tantangan nyata, variasi soal otentik, kunci jawaban valid, dan penjelasan edukatif (gunakan bank materi terstruktur dan variasi soal per babak agar semua level terisi penuh dan unik).
> 4. **AMAN & NYAMAN DIMAINKAN**: Jangan gunakan popup dialog bawaan browser yang mengganggu (alert/confirm/prompt); gunakan modal ramah anak di dalam layar game. Pastikan penyimpanan progres tetap aman walau dimainkan di mode sandbox/preview.
> 5. **SEMUA TOMBOL BERFUNGSI NYATA**: Setiap tombol, peta level, petunjuk (Hint), jeda (Pause), audio, dan tombol ulang wajib bekerja secara interaktif.

---

## 2. IDENTITAS & BRANDING GAME
- **Nama Game**: ${config.gameTitle}
- **Tagline**: Create • Play • Learn — Petualangan Pengetahuan Interaktif
- **Jenjang Pendidikan Sasaran**: ${config.level} (${effectiveAge})
- **Mata Pelajaran**: ${effectiveSubject}
- **Genre Permainan**: ${effectiveGenre}
- **Tema Visual & Dunia**: ${effectiveTheme}
- **Gaya Seni (Art Style)**: ${config.artStyle}
- **Total Level Permainan**: ${totalLevels} Level Berjenjang (Level 1 sampai Level ${totalLevels})

---

## 3. PROFIL PEMAIN & ADAPTASI PSIKOMOTORIK (${config.level})
- **Rentang Usia Pemain**: ${effectiveAge}
- **Karakteristik Kognitif**: ${meta.designGuidelines.cognitiveLevel}
- **Spesifikasi Teks & Instruksi**: ${meta.designGuidelines.textLength}
- **Gaya Kontrol & Interaksi**: ${meta.designGuidelines.controls}
- **Kebijakan Hukuman & Kesalahan**: ${meta.designGuidelines.penalty}
- **Karakteristik Tambahan Pemain**: ${config.playerCharacteristics || 'Pemain menyukai visual hangat, umpan balik instan yang menyemangati, dan progresi level yang terasa memuaskan.'}

---

## 4. TUJUAN PEMBELAJARAN & STANDAR KOMPETENSI
- **Tujuan Pembelajaran Utama**: ${config.learningObjectives}
- **Kompetensi Dasar / Capaian Pembelajaran**: ${config.targetCompetencies}
- **Pengetahuan Prasyarat Pemain**: ${config.priorKnowledge || 'Pengetahuan umum dasar sesuai jenjang pendidikan.'}

---

## 5. ANALISIS MATERI & DEKOMPOSISI PEDAGOGI
- **Topik Utama**: ${config.mainTopic}
- **Subtopik Rinci**: ${config.subtopics}
- **Alur Scaffolding Materi**:
  Materi harus didistribusikan merata dari Level 1 hingga Level ${totalLevels}: dimulai dari pengenalan konsep dasar di Babak 1, latihan variasi dan aplikasi di babak tengah, hingga analisis kasus dan sintesis menyeluruh di Babak Akhir & Boss Battle.

---

## 6. KONSEP PERMAINAN & CORE GAMEPLAY LOOP
Implementasikan siklus bermain inti (**Core Loop**) berikut secara nyata:
\`[Main Menu] → [World / Level Map] → [Intro Misi Singkat] → [Aktivitas & Tantangan Interaktif (${config.levelSettings.questionsPerLevel} pos/level)] → [Validasi + Penjelasan Edukatif] → [Skor, Bintang 1–3 & Koin] → [Unlock Level Berikutnya / Victory Screen]\`

---

## 7. STORYLINE & LATAR BELAKANG PETUALANGAN
Di dunia **${effectiveTheme}**, sumber cahaya pengetahuan **${config.mainTopic}** mulai meredup karena Kabut Kebingungan. **${charLead.name}** bersama pembimbingnya **${charMentor.name}** memulai ekspedisi melintasi **${chapters.length} wilayah dunia** dan menaklukkan **${totalLevels} level tantangan** untuk mengembalikan cahaya kebijaksanaan serta mengalahkan Boss Penjaga di puncak petualangan.

---

## 8. GENRE & GAYA INTERAKSI
- **Genre Utama**: ${effectiveGenre}
- **Nuansa Visual**: Terapkan palet warna tematik **${effectiveTheme}** bergaya **${config.artStyle}** menggunakan CSS gradient, dekorasi SVG latar, dan kartu berbayangan halus yang ramah mata anak.

---

## 9. MEKANISME GAMEPLAY INTERAKTIF (WAJIB BERFUNGSI NYATA)
Implementasikan minimal 2 variasi mekanisme interaksi nyata di dalam permainan dari daftar berikut (bergantian antar level agar tidak membosankan):
${config.mechanics.map((m) => `- **${m}**: Harus dapat dimainkan penuh via klik/sentuh dengan validasi akurat.`).join('\n')}
*Tips Implementasi*: Variasikan interaksi seperti Pilihan Ganda Visual berilustrasi, Benar/Salah cepat, Urutkan Langkah secara berurutan, Cocokkan Pasangan kiri-kanan, Isian Singkat, serta Klasifikasi Kategori agar setiap babak terasa segar.

---

## 10. KARAKTER DAN KONSISTENSI VISUAL
Buat ilustrasi **inline SVG karakter** yang konsisten warna, ekspresi (senang saat benar, menyemangati saat salah), dan perannya di seluruh layar:
${charListString}
${hasUploadedCharacter ? '- **Instruksi Konsistensi Karakter Kustom**: Pertahankan siluet, warna pakaian dominan, dan ciri khas karakter kustom pengguna secara konsisten pada Main Menu, dialog pemandu, HUD, dan Victory Screen.' : ''}
- **${charMentor.name}** wajib muncul pada tombol **Hint (Petunjuk)** untuk membisikkan bantuan pedagogis tanpa langsung membocorkan jawaban.

---

## 11. STRUKTUR ARSITEKTUR LEVEL & WORLD MAP (${chapters.length} BABAK · ${totalLevels} LEVEL)
Bagilah seluruh **${totalLevels} Level** ke dalam **${chapters.length} Babak Dunia**:
${chaptersBreakdownString}

Tampilkan halaman **World / Chapter Map** yang menarik dengan:
- Tab/filter per Babak Dunia agar ${totalLevels} level tetap rapi dan mudah dinavigasi di desktop maupun ponsel.
- Indikator jelas untuk: **Level Terbuka**, **Level Selesai (1–3 Bintang emas)**, **Level Terkunci (ikon gembok)**, dan **Level Boss (ikon mahkota)**.

---

## 12. CETAK BIRU MILESTONE LEVEL (PERLUAS UNTUK SEMUA ${totalLevels} LEVEL)
Berikut peta milestone yang wajib diimplementasikan dan diperluas ke seluruh Level 1–${totalLevels}:

${sampleLevelsString}

---

## 13. BANK SOAL & GENERATOR TANTANGAN OTENTIK
- Setiap level berisi **${config.levelSettings.questionsPerLevel} soal/aktivitas interaktif** yang nyata, akurat secara keilmuan, dan sesuai jenjang **${config.level}** untuk mata pelajaran **${effectiveSubject}** (topik: **${config.mainTopic}**, subtopik: **${config.subtopics}**).
- **WAJIB KONTEN ASLI**: Semua teks pertanyaan, angka, istilah, pilihan jawaban, dan penjelasan wajib berisi konten pelajaran **${effectiveSubject}** yang **100% asli dan akurat** (dilarang keras menulis kalimat generik seperti "Contoh soal level 1" atau "Jawaban benar A").
- **STRATEGI ANTI-DUPLIKASI & ANTI-TRUNCATION**: Untuk ${totalLevels} level, buat fungsi generator soal cerdas berbasis bank konsep/template soal per babak + variasi parameter/urutan yang di-seed per nomor level sehingga setiap level memiliki pertanyaan unik, tidak berulang-ulang, namun ukuran kode tetap ringkas dan tuntas 100%.

---

## 14. KUNCI JAWABAN & VALIDASI LOGIKA
- Setiap objek soal menyimpan kunci jawaban valid (\`answer\`), daftar opsi (\`options\` / \`pairs\` / \`sequence\`), teks petunjuk (\`hint\`), dan penjelasan (\`explanation\`).
- Kunci tombol setelah pemain menjawab satu soal agar tidak terjadi double-click scoring bug.

---

## 15. PENJELASAN JAWABAN & UMPAN BALIK EDUKATIF
- **Jawaban BENAR**: Animasi ceria karakter, efek suara arpeggio mayor, penambahan skor + kombo, serta kotak penjelasan singkat yang menguatkan pemahaman materi.
- **Jawaban SALAH**: Pesan empatik dari **${charMentor.name}** yang menjelaskan konsep benarnya dengan bahasa positif dan tombol lanjut/coba lagi tanpa menjatuhkan mental anak.

---

## 16. KURVA PROGRESI KESULITAN
- **Kurva**: ${config.levelSettings.difficultyCurve}
- **Level 1–${Math.max(1, Math.round(totalLevels * 0.2))}**: Mode Pengenalan ramah (bantuan tutorial aktif, soal dasar).
- **Level ${Math.round(totalLevels * 0.2) + 1}–${Math.round(totalLevels * 0.7)}**: Aplikasi & eksplorasi multi-mekanisme.
- **Level ${Math.round(totalLevels * 0.7) + 1}–${totalLevels}**: Tantangan analitis lebih tinggi dan Boss Battle puncak.

---

## 17. SISTEM SKOR & KOMBO
- Jawaban benar: **+100 Poin Dasar** + **Bonus Kombo** (\`+25 × streak\`) untuk jawaban benar berturut-turut.
- Tampilkan skor total dan indikator kombo secara real-time di HUD atas.

---

## 18. SISTEM REWARD: BINTANG, KOIN & HINT
- **Bintang (1–3 per level)**: 3 bintang (akurasi 100% tanpa salah), 2 bintang (akurasi ≥ 70%), 1 bintang (lulus syarat minimum level).
- **Koin Ilmu**: Setiap jawaban benar & bintang memberikan koin akumulatif.
- **Tombol Hint**: Dapat ditekan saat bermain untuk menampilkan petunjuk edukatif dari **${charMentor.name}**.

---

## 19. SISTEM UNLOCK LEVEL & REPLAY
- Level 1 terbuka otomatis saat permainan pertama kali dimulai.
- Menyelesaikan Level N dengan minimal 1 bintang otomatis membuka Level N+1.
- Semua level yang sudah selesai dapat dimainkan ulang kapan saja untuk meningkatkan bintang dan skor tertinggi.

---

## 20. SISTEM PENYIMPANAN PROGRES (SAFE LOCALSTORAGE)
- Simpan progres pada \`localStorage\` dengan kunci \`${storageKey}\` yang **wajib dibungkus \`try { ... } catch (e) {}\`** (memiliki fallback objek di RAM jika dijalankan dalam sandbox iframe).
- Simpan: \`unlockedLevel\`, \`starsByLevel\`, \`highScores\`, \`totalScore\`, \`coins\`, dan \`soundMuted\`.
- Sediakan tombol **"Reset Progres"** dengan modal konfirmasi kustom di dalam game.

---

## 21. BOSS BATTLE MILESTONE
Pada level Boss (Level **${bossLevelsList}**):
- Tampilkan banner khusus **"BOSS BATTLE"**, ilustrasi SVG Boss penjaga, dan **Boss HP Bar** (berkurang setiap kali pemain menjawab benar!).
- Setiap jawaban benar memicu efek animasi serangan cahaya ilmu ke Boss.

---

## 22. FINAL CHALLENGE & CLIMAX GAME
Pada **Level ${totalLevels}**:
- Pemain menghadapi **"${config.levelSettings.finalChallengeName || 'Ujian Agung Penjaga Kebijaksanaan'}"** yang merangkum inti seluruh materi dari Babak 1 hingga Babak Akhir.

---

## 23. ENDING GAME & LAPORAN HASIL BELAJAR (VICTORY SCREEN)
Saat Level ${totalLevels} ditaklukkan (dan juga dapat dilihat ringkasannya melalui tombol **Laporan Belajar** di peta):
- Layar selebrasi kemenangan dengan animasi konfeti Canvas/CSS.
- **Kartu Laporan Hasil Belajar**: Total Bintang (\`X / ${totalLevels * 3}\`), Total Skor, Level Diselesaikan, Predikat Penguasaan Materi, dan pesan apresiasi dari **${charMentor.name}**.
- Tombol **"Mainkan Ulang"** dan **"Kembali ke Peta Level"**.

---

## 24. DESAIN UI/UX GAMEPLAY & KELENGKAPAN LAYAR
Pastikan semua layar berikut tersedia dan berfungsi 100%:
1. **Main Menu**: Logo/judul game, ilustrasi SVG **${charLead.name}**, tombol **"Mulai Petualangan"**, **"Peta Level"**, **"Cara Bermain"**, dan toggle Audio.
2. **Tutorial Modal / Overlay**: Panduan singkat 3 langkah cara bermain yang ramah anak.
3. **World / Level Map**: Navigasi seluruh ${totalLevels} level dikelompokkan per Babak Dunia.
4. **In-Game HUD**: Tombol Pause, Nomor & Nama Level, Progress Bar soal (\`Soal X/${config.levelSettings.questionsPerLevel}\`), Skor, Koin, Nyawa (${config.levelSettings.livesCount > 0 ? `${config.levelSettings.livesCount} Hati` : 'Tak Terbatas ∞'}), dan Tombol Hint.
5. **Modal Pause**: Lanjutkan, Ulangi Level, Kembali ke Peta Level.
6. **Layar Level Selesai & Layar Coba Lagi**: Ringkasan bintang, skor, tombol **"Level Berikutnya"** dan **"Ulangi"**.

---

## 25. ANIMASI & EFEK VISUAL
- Transisi layar halus, efek tombol ditekan, animasi getar lembut saat salah, dan animasi konfeti bintang saat menang level.

---

## 26. AUDIO SINTETIS (WEB AUDIO API)
Implementasikan modul \`SoundFX\` menggunakan \`AudioContext\` Web Audio API (tanpa file audio eksternal):
- Suara klik tombol lembut.
- Arpeggio ceria (\`C5–E5–G5–C6\`) saat jawaban benar & fanfare kemenangan level.
- Nada lembut empatik (\`C4–A3\`) saat jawaban kurang tepat.
- Tombol Mute/Unmute selalu tersedia di pojok HUD.

---

## 27. SISTEM MENANG, KALAH & RETRY RAMAH ANAK
- ${config.levelSettings.livesCount > 0 ? `Jika ${config.levelSettings.livesCount} nyawa habis, tampilkan layar penyemangat "Jangan Menyerah! Ayo Coba Lagi!" dengan tombol langsung mengulang level tanpa menghapus progres level sebelumnya.` : 'Mode Nyawa Tak Terbatas aktif: anak dapat terus belajar dan mencoba kembali sampai berhasil tanpa takut Game Over.'}

---

## 28. KETAHANAN EDGE CASE & RESPONSIVITAS
- Responsif sempurna dari lebar layar 360px (HP) hingga 1440px+ (Desktop).
- Tidak ada teks terpotong, tidak ada \`undefined\` atau \`NaN\` di skor/soal, dan aman dari spam klik cepat.

---

## 29. STANDAR KUALITAS & KELANCARAN PERMAINAN
- Game berjalan mulus dan mandiri di perangkat desktop, tablet, maupun ponsel tanpa aset eksternal yang terputus.
- Seluruh alur interaksi, tombol navigasi, perhitungan skor, transisi antar level, dan efek suara dipastikan bersih dari bug atau galat logika.

---

## 30. PERINTAH AKHIR
**Buatkan game edukasi "${config.gameTitle}" secara lengkap dan langsung dapat dimainkan sekarang!**
1. Pastikan **seluruh ${totalLevels} level**, Peta Babak, Bank Soal Otentik **${effectiveSubject}**, ilustrasi karakter **${charLead.name}** & **${charMentor.name}**, efek suara interaktif, Boss Battle, dan Layar Laporan Hasil Belajar benar-benar tersedia dan dapat langsung dimainkan.
2. Jangan hanya memberikan konsep, kerangka, ringkasan, atau potongan sebagian — langsung buatkan game interaktif utuh yang siap dimainkan sekarang juga!`;

  return {
    promptText: promptText.trim(),
    chapters,
    sampleLevels
  };
}
