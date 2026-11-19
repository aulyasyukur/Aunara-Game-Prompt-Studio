/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EducationLevel = 'PAUD' | 'TK' | 'SD' | 'SMP' | 'SMA' | 'CUSTOM';

export type SubjectCategory =
  | 'Matematika'
  | 'Bahasa Indonesia'
  | 'Bahasa Inggris'
  | 'IPA'
  | 'IPAS'
  | 'IPS'
  | 'Pendidikan Agama Islam'
  | 'Sejarah'
  | 'Geografi'
  | 'Biologi'
  | 'Fisika'
  | 'Kimia'
  | 'Ekonomi'
  | 'Informatika'
  | 'Pancasila'
  | 'Literasi'
  | 'Numerasi'
  | 'Pengetahuan Umum'
  | 'Seni dan Kreativitas'
  | 'CUSTOM';

export type GameGenre =
  | 'Educational Adventure'
  | 'Educational RPG'
  | 'Quiz Adventure'
  | 'Puzzle'
  | 'Matching Game'
  | 'Memory Game'
  | 'Platformer'
  | 'Interactive Story'
  | 'Escape Room'
  | 'Simulation'
  | 'Exploration'
  | 'Word Search'
  | 'Crossword'
  | 'Math Adventure'
  | 'Science Adventure'
  | 'Logic Game'
  | 'Strategy Game'
  | 'Board Game'
  | 'Islamic Adventure'
  | 'CUSTOM';

export type GameMechanic =
  | 'Multiple Choice'
  | 'True or False'
  | 'Drag and Drop'
  | 'Matching Pairs'
  | 'Fill in the Blank'
  | 'Typing Challenge'
  | 'Collect Objects'
  | 'Arrange in Order'
  | 'Solve Puzzles'
  | 'Exploration'
  | 'Mission Based'
  | 'Obstacle Challenge'
  | 'Simulation'
  | 'Memory Challenge'
  | 'Interactive Dialogue'
  | 'Character Movement'
  | 'Classification'
  | 'CUSTOM';

export type GameTheme =
  | 'Dunia Hewan'
  | 'Hutan Ajaib'
  | 'Kerajaan Fantasi'
  | 'Petualangan Luar Angkasa'
  | 'Dunia Bawah Laut'
  | 'Zaman Dinosaurus'
  | 'Kota Masa Depan'
  | 'Laboratorium Sains'
  | 'Dunia Robot'
  | 'Lingkungan dan Alam'
  | 'Petualangan Islami'
  | 'Kehidupan Sehari-hari'
  | 'Negeri Dongeng'
  | 'CUSTOM';

export type ArtStyle =
  | 'Cute Cartoon'
  | '2D Illustration'
  | '3D Look'
  | 'Pixel Art'
  | 'Flat Design'
  | 'Watercolor'
  | 'Fantasy'
  | 'Islamic Cartoon'
  | 'Futuristic'
  | 'Minimalist';

export interface GameCharacter {
  id: string;
  name: string;
  role: 'Protagonis Utama' | 'Karakter Pendukung' | 'Mentor / Guru' | 'Rival Ramah';
  description: string;
  dominantColor: string;
  imageUrl?: string;
  isCustomUpload?: boolean;
}

export interface LevelSettings {
  levelCount: number; // 5, 10, 15, 20, 30, 40, 50, or custom
  customLevelCount?: number;
  challengesPerLevel: number; // default 3
  questionsPerLevel: number; // default 3-5
  durationPerLevel: string; // e.g. "3-5 Menit"
  difficultyCurve: 'Gradual Linear' | 'Steep Dynamic' | 'Gentle Adaptive';
  livesCount: number; // e.g. 3, 5, or unlimited
  scoringSystem: string; // e.g. "Poin Skor + Multiplier Kombo"
  hasStars: boolean; // 1-3 stars
  hasCoins: boolean;
  hasHints: boolean;
  bossInterval: number; // e.g. every 5 or 10 levels, or only final
  finalChallengeName: string;
  endingNarrative: string;
}

export interface GameConfig {
  // Step 1: Jenjang
  level: EducationLevel;
  customAgeRange?: string;
  customGrade?: string;
  targetAge: string;
  playerCharacteristics: string;

  // Step 2: Mata Pelajaran
  subject: SubjectCategory;
  customSubject?: string;

  // Step 3: Materi
  gameTitle: string;
  mainTopic: string;
  subtopics: string;
  learningObjectives: string;
  targetCompetencies: string;
  priorKnowledge: string;

  // Step 4: Genre & Mekanisme
  genre: GameGenre;
  customGenre?: string;
  mechanics: GameMechanic[];
  customMechanic?: string;

  // Step 5: Tema & Karakter
  theme: GameTheme;
  customTheme?: string;
  artStyle: ArtStyle;
  characters: GameCharacter[];

  // Step 6: Level Settings
  levelSettings: LevelSettings;
}

export interface LevelChapter {
  chapterIndex: number;
  chapterName: string;
  worldName: string;
  levelRange: [number, number];
  themeDescription: string;
  pedagogicalFocus: string;
  bossLevel?: number;
  bossName?: string;
}

export interface GeneratedLevelPlan {
  levelNumber: number;
  levelName: string;
  worldName: string;
  shortStory: string;
  learningObjective: string;
  mainMission: string;
  uniqueChallenge: string;
  topicMaterial: string;
  sampleActivity: string;
  sampleQuestion: string;
  sampleAnswer: string;
  answerExplanation: string;
  difficulty: 'Mudah' | 'Sedang' | 'Menantang' | 'Master / Boss';
  reward: string;
  clearRequirement: string;
  unlockNextCondition: string;
}

export interface SavedPrompt {
  id: string;
  createdAt: string;
  updatedAt: string;
  config: GameConfig;
  fullPromptText: string;
  summary: {
    title: string;
    level: string;
    subject: string;
    genre: string;
    theme: string;
    totalLevels: number;
  };
  chapters: LevelChapter[];
  sampleLevels: GeneratedLevelPlan[];
}

export interface EducationalTemplate {
  id: string;
  name: string;
  level: EducationLevel;
  targetAge: string;
  subject: SubjectCategory;
  description: string;
  learningObjectives: string;
  genre: GameGenre;
  theme: GameTheme;
  recommendedLevels: number;
  artStyle: ArtStyle;
  mechanics: GameMechanic[];
  defaultTopic: string;
  defaultSubtopics: string;
  defaultCompetencies: string;
}

export interface AuthUser {
  uid?: string;
  username: string;
  displayName: string;
  email?: string;
  photoUrl?: string;
  role: string;
  authProvider: 'server-email';
  loggedInAt: string;
}

