/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EducationLevel, SubjectCategory, GameGenre, GameMechanic, ArtStyle, GameTheme } from '../types/game';

export interface LevelMetadata {
  level: EducationLevel;
  name: string;
  defaultAge: string;
  description: string;
  designGuidelines: {
    visuals: string;
    textLength: string;
    controls: string;
    penalty: string;
    cognitiveLevel: string;
  };
  recommendedGenres: GameGenre[];
  recommendedMechanics: GameMechanic[];
  recommendedArtStyles: ArtStyle[];
}

export const EDUCATION_LEVELS: Record<EducationLevel, LevelMetadata> = {
  PAUD: {
    level: 'PAUD',
    name: 'PAUD (Pendidikan Anak Usia Dini)',
    defaultAge: '2–4 Tahun',
    description: 'Fokus pada stimulasi sensorik, motorik halus, pengenalan warna, suara, dan bentuk dasar dengan interaksi riang tanpa tekanan.',
    designGuidelines: {
      visuals: 'Objek besar, warna hangat cerah, kontras jelas, minim teks.',
      textLength: 'Sangat sedikit (1-3 kata) didukung audio/suara vokal.',
      controls: 'Tombol sentuh/klik ekstra besar, gesture drag sederhana.',
      penalty: 'Tidak ada hukuman atau "game over". Kesalahan diberi animasi ceria dan kesempatan mencoba lagi.',
      cognitiveLevel: 'Sensory motor, pengenalan objek, asosiasi visual-bunyi.'
    },
    recommendedGenres: ['Matching Game', 'Memory Game', 'Puzzle', 'Interactive Story', 'Music Game' as any],
    recommendedMechanics: ['Drag and Drop', 'Matching Pairs', 'Collect Objects', 'True or False'],
    recommendedArtStyles: ['Cute Cartoon', 'Watercolor', 'Flat Design']
  },
  TK: {
    level: 'TK',
    name: 'TK (Taman Kanak-Kanak)',
    defaultAge: '4–6 Tahun',
    description: 'Transisi pra-membaca, angka 1–20, huruf alfabet/hijaiyah, adab sosial, dan pengelompokan benda dengan narasi petualangan imajinatif.',
    designGuidelines: {
      visuals: 'Ilustrasi lucu, dunia petualangan hewan atau dongeng, icon intuitif.',
      textLength: 'Teks instruksi singkat (1 kalimat sederhana) dengan ikon pembantu.',
      controls: 'Tap, drag and drop, seleksi kartu visual.',
      penalty: 'Nyawa fleksibel (bintang tetap didapat walau mengulang).',
      cognitiveLevel: 'Pra-operasional: simbolik, kategorisasi, urutan 1-20.'
    },
    recommendedGenres: ['Educational Adventure', 'Matching Game', 'Word Search', 'Puzzle', 'Math Adventure'],
    recommendedMechanics: ['Matching Pairs', 'Arrange in Order', 'Drag and Drop', 'Multiple Choice', 'Collect Objects'],
    recommendedArtStyles: ['Cute Cartoon', '2D Illustration', 'Islamic Cartoon', 'Watercolor']
  },
  SD: {
    level: 'SD',
    name: 'SD (Sekolah Dasar)',
    defaultAge: '7–12 Tahun (Kelas 1–6)',
    description: 'Petualangan terstruktur dengan misi, eksplorasi sains, matematika hitung, literasi bacaan bertingkat, dan sistem skor yang memotivasi.',
    designGuidelines: {
      visuals: 'Penuh petualangan, dunia fantasi, peta penjelajah (world map), lencana pencapaian.',
      textLength: 'Paragraf pendek naratif, petunjuk soal jelas dan ringkas.',
      controls: 'Interaktif keyboard/touch, tombol aksi, mini puzzle solving.',
      penalty: 'Sistem 3-5 nyawa, fitur coba lagi, checkpoint ramah anak.',
      cognitiveLevel: 'Operasional konkret: logika berhitung, klasifikasi sains, penalaran sebab-akibat.'
    },
    recommendedGenres: ['Educational Adventure', 'Platformer', 'Quiz Adventure', 'Math Adventure', 'Science Adventure', 'Educational RPG'],
    recommendedMechanics: ['Multiple Choice', 'Drag and Drop', 'Solve Puzzles', 'Mission Based', 'Arrange in Order', 'Collect Objects'],
    recommendedArtStyles: ['2D Illustration', '3D Look', 'Pixel Art', 'Cute Cartoon', 'Fantasy']
  },
  SMP: {
    level: 'SMP',
    name: 'SMP (Sekolah Menengah Pertama)',
    defaultAge: '12–15 Tahun (Kelas 7–9)',
    description: 'Tantangan logika tingkat menengah, simulasi fenomena ilmiah, aljabar, penalaran kritis, dan misteri berbasis pengetahuan.',
    designGuidelines: {
      visuals: 'Modern, semi-realistis, visual laboratorium sains atau sci-fi.',
      textLength: 'Studi kasus pendek, data tabel/grafik sederhana, teks literasi kritis.',
      controls: 'Sistem inventory, slider simulasi, puzzle aljabar dan strategi.',
      penalty: 'Manajemen batas waktu, skor performa, evaluasi hasil belajar.',
      cognitiveLevel: 'Transisi ke operasional formal: penalaran abstrak, eksperimen variabel, problem solving.'
    },
    recommendedGenres: ['Educational RPG', 'Escape Room', 'Simulation', 'Science Adventure', 'Logic Game', 'Strategy Game'],
    recommendedMechanics: ['Solve Puzzles', 'Interactive Dialogue', 'Simulation', 'Fill in the Blank', 'Classification', 'Multiple Choice'],
    recommendedArtStyles: ['2D Illustration', '3D Look', 'Futuristic', 'Pixel Art', 'Flat Design']
  },
  SMA: {
    level: 'SMA',
    name: 'SMA / SMK (Sekolah Menengah Atas)',
    defaultAge: '15–18 Tahun (Kelas 10–12)',
    description: 'Simulasi mendalam, High Order Thinking Skills (HOTS), kalkulasi ilmiah, ekonomi makro, pemecahan masalah multidisiplin.',
    designGuidelines: {
      visuals: 'Elegan, canggih, minim elemen kekanak-kanakan, UI modern berbasis data.',
      textLength: 'Kasus kontekstual, artikel analitis, formula matematis terintegrasi.',
      controls: 'Eksperimen parameter multi-variabel, branching narrative pilihan dilematis.',
      penalty: 'Evaluasi akurasi menyeluruh, analitik kelemahan materi di akhir game.',
      cognitiveLevel: 'Operasional formal tinggi: analisis kritis, evaluasi data empiris, sintesis solusi inovatif.'
    },
    recommendedGenres: ['Simulation', 'Escape Room', 'Strategy Game', 'Logic Game', 'Educational RPG', 'Interactive Story'],
    recommendedMechanics: ['Simulation', 'Solve Puzzles', 'Classification', 'Interactive Dialogue', 'Typing Challenge', 'Multiple Choice'],
    recommendedArtStyles: ['Futuristic', '3D Look', 'Minimalist', 'Flat Design', '2D Illustration']
  },
  CUSTOM: {
    level: 'CUSTOM',
    name: 'Custom / Spesifik',
    defaultAge: 'Bebas Disesuaikan',
    description: 'Konfigurasi sepenuhnya disesuaikan oleh pengguna untuk target audiens khusus, pelatihan guru, kuis komunitas, atau anak berkebutuhan khusus.',
    designGuidelines: {
      visuals: 'Dapat disesuaikan sesuai kebutuhan audiens.',
      textLength: 'Fleksibel.',
      controls: 'Fleksibel.',
      penalty: 'Fleksibel.',
      cognitiveLevel: 'Disesuaikan dengan profil peserta.'
    },
    recommendedGenres: ['Quiz Adventure', 'Educational Adventure', 'Puzzle', 'Simulation'],
    recommendedMechanics: ['Multiple Choice', 'True or False', 'Drag and Drop', 'Solve Puzzles'],
    recommendedArtStyles: ['2D Illustration', 'Flat Design', 'Cute Cartoon']
  }
};

export const SUBJECT_TOPICS_RECOMMENDATIONS: Record<SubjectCategory, {
  defaultTopic: string;
  subtopics: string;
  objectives: string;
  competencies: string;
  priorKnowledge: string;
}> = {
  Matematika: {
    defaultTopic: 'Operasi Bilangan & Pemecahan Masalah Kontekstual',
    subtopics: 'Penjumlahan, Pengurangan, Perkalian, Pola Bilangan, dan Logika Pecahan',
    objectives: 'Siswa mampu memahami konsep dasar perhitungan dan menerapkannya dalam menyelesaikan teka-teki logika petualangan.',
    competencies: 'Menghitung dengan tepat, mengidentifikasi pola numerik, dan memecahkan soal cerita berbasis logika.',
    priorKnowledge: 'Mengenal angka dan konsep dasar berhitung berulang.'
  },
  'Bahasa Indonesia': {
    defaultTopic: 'Pemahaman Bacaan, Kosakata & Struktur Kalimat',
    subtopics: 'Ide Pokok Paragraf, Kosakata Baru, Antonim-Sinonim, dan Menyusun Kalimat Efektif',
    objectives: 'Meningkatkan daya literasi, memperkaya kosakata baku, serta melatih kemampuan memahami amanat dan alur cerita.',
    competencies: 'Menemukan informasi tersurat & tersirat, menyusun kata acak menjadi kalimat padu, dan mengidentifikasi unsur intrinsik cerita.',
    priorKnowledge: 'Kemampuan membaca lancar dan memahami makna kalimat sederhana.'
  },
  'Bahasa Inggris': {
    defaultTopic: 'English Vocabulary & Daily Communication Quests',
    subtopics: 'Daily Greetings, Objects Around Us, Action Verbs, and Simple Present Tense Sentences',
    objectives: 'Membantu siswa percaya diri mengenali kosakata bahasa Inggris dan menggunakannya dalam dialog interaktif.',
    competencies: 'Matching English words with visual objects, forming basic sentences, and answering comprehension questions in English.',
    priorKnowledge: 'Basic phonics and familiarity with common everyday English words.'
  },
  IPA: {
    defaultTopic: 'Eksplorasi Sains: Siklus Makhluk Hidup & Sumber Energi',
    subtopics: 'Metamorfosis Hewan, Rantai Makanan, Bagian Tumbuhan, dan Energi Terbarukan',
    objectives: 'Menumbuhkan rasa ingin tahu ilmiah melalui observasi fenomena alam dan rantai kehidupan di ekosistem.',
    competencies: 'Mengklasifikasikan hewan berdasarkan habitat/makanannya, merangkai rantai makanan, dan menjelaskan perubahan wujud benda.',
    priorKnowledge: 'Mengenal berbagai jenis hewan dan tumbuhan di lingkungan sekitar.'
  },
  IPAS: {
    defaultTopic: 'Harmoni Alam dan Manusia: Ekosistem & Peta Wilayah',
    subtopics: 'Simbiosis Ekosistem, Kekayaan Alam Daerah, Perkembangan Iptek, dan Pelestarian Lingkungan',
    objectives: 'Memadukan pemahaman sains alam dengan kearifan sosial dalam menjaga kelestarian lingkungan hidup.',
    competencies: 'Menganalisis hubungan timbal balik antar makhluk hidup dan peran masyarakat dalam merawat keanekaragaman hayati.',
    priorKnowledge: 'Pemahaman awal tentang lingkungan tempat tinggal dan kebutuhan hidup makhluk hidup.'
  },
  IPS: {
    defaultTopic: 'Kegiatan Ekonomi, Geografi Budaya & Interaksi Sosial',
    subtopics: 'Produsen-Distributor-Konsumen, Peta Indonesia, Ragam Budaya Nusantara, dan Interaksi Masyarakat',
    objectives: 'Memahami bagaimana manusia memenuhi kebutuhan hidup dan beradaptasi dengan lingkungan geografis serta budaya lokal.',
    competencies: 'Mengidentifikasi jalur distribusi barang, mengenal simbol peta kepulauan, dan mengapresiasi keragaman adat nusantara.',
    priorKnowledge: 'Konsep uang, belanja kebutuhan sehari-hari, dan mengenal pulau-pulau besar Indonesia.'
  },
  'Pendidikan Agama Islam': {
    defaultTopic: 'Rukun Iman, Kisah Teladan Rasul, dan Adab Terpuji',
    subtopics: 'Mengenal 6 Rukun Iman, Adab Berbakti pada Orang Tua & Guru, Tata Cara Bersuci (Wudhu), dan Sedekah',
    objectives: 'Menanamkan nilai-nilai akhlak karimah, membiasakan ibadah harian dengan benar, dan meneladani sifat mulia para nabi.',
    competencies: 'Menghafal urutan rukun iman, mengurutkan rukun wudhu secara runtut, dan memilih tindakan berakhlak mulia dalam skenario game.',
    priorKnowledge: 'Mengenal kalimat thayyibah (basmalah, hamdalah) dan rukun Islam secara umum.'
  },
  Sejarah: {
    defaultTopic: 'Jejak Kerajaan Nusantara hingga Perjuangan Kemerdekaan',
    subtopics: 'Kerajaan Sriwijaya & Majapahit, Peristiwa Rengasdengklok, Detik-Detik Proklamasi, dan Tokoh Pahlawan Nasional',
    objectives: 'Membangkitkan rasa nasionalisme dan memahami kronologi historis perjuangan para pendiri bangsa.',
    competencies: 'Mengurutkan peristiwa bersejarah secara kronologis, mengenali peran tokoh pahlawan, dan menganalisis nilai persatuan bangsa.',
    priorKnowledge: 'Mengenal hari kemerdekaan 17 Agustus dan bendera Merah Putih.'
  },
  Geografi: {
    defaultTopic: 'Dinamika Geosfer: Litosfer, Atmosfer & Bentang Alam Bumi',
    subtopics: 'Peta Topografi, Lapisan Bumi & Gunung Api, Iklim & Cuaca, serta Mitigasi Bencana Alam',
    objectives: 'Melatih kemampuan spasial membaca peta dan memahami proses pembentukan bentang alam di planet Bumi.',
    competencies: 'Membaca koordinat & skala peta, menganalisis faktor cuaca, dan menentukan jalur evakuasi mitigasi bencana.',
    priorKnowledge: 'Mengenal arah mata angin (Utara, Timur, Selatan, Barat) dan benua di dunia.'
  },
  Biologi: {
    defaultTopic: 'Sistem Organ Tubuh Manusia & Keanekaragaman Hayati',
    subtopics: 'Sistem Pencernaan & Peredaran Darah, Struktur Sel Hewan/Tumbuhan, Genetika Dasar, dan Ekosistem',
    objectives: 'Memahami cara kerja mekanisme biologis dalam menopang kehidupan dan menjaga homeostasis tubuh.',
    competencies: 'Menjelaskan alur organ pernapasan, mengidentifikasi organel sel, dan memprediksi dampak gangguan pada jaringan tubuh.',
    priorKnowledge: 'Mengenal bagian luar tubuh manusia dan kebutuhan nutrisi makanan sehat.'
  },
  Fisika: {
    defaultTopic: 'Hukum Gerak Newton, Tekanan & Transformasi Energi',
    subtopics: 'Gaya Gesek & Gravitasi, Hukum I-II-III Newton, Tekanan Zat Cair (Fluida), dan Rangkaian Listrik Sederhana',
    objectives: 'Menghubungkan rumus fisika dengan eksperimen visual nyata dalam memecahkan teka-teki mekanika game.',
    competencies: 'Menghitung resultan gaya, merancang sirkuit listrik yang menyala, dan memecahkan tantangan platformer fisika.',
    priorKnowledge: 'Konsep kecepatan, jarak, dan pemahaman bahwa benda jatuh karena gravitasi.'
  },
  Kimia: {
    defaultTopic: 'Tabel Periodik Unsur, Ikatan Kimia & Reaksi Asam-Basa',
    subtopics: 'Simbol Unsur Kimia, Konfigurasi Elektron, Reaksi Pembentukan Senyawa, dan Indikator pH Larutan',
    objectives: 'Membuat konsep mikroskopis atom dan molekul menjadi visual, interaktif, dan mudah dimengerti.',
    competencies: 'Menggabungkan ion kation-anion menjadi senyawa stabil, menyeimbangkan persamaan reaksi sederhana, dan menguji larutan indikator.',
    priorKnowledge: 'Mengenal konsep wujud zat (padat, cair, gas) dan campuran zat air-garam.'
  },
  Ekonomi: {
    defaultTopic: 'Literasi Finansial, Manajemen Usaha & Hukum Pasar',
    subtopics: 'Permintaan & Penawaran, Anggaran Tabungan vs Pengeluaran, Bisnis Rintisan (Entrepreneurship), dan Investasi Bijak',
    objectives: 'Melatih kecerdasan finansial sejak dini dalam mengelola sumber daya, modal, dan pengambilan keputusan laba-rugi.',
    competencies: 'Menghitung titik impas (BEP), menentukan strategi harga jual dalam simulasi toko, dan membedakan kebutuhan primer vs sekunder.',
    priorKnowledge: 'Memahami fungsi uang sebagai alat tukar barang.'
  },
  Informatika: {
    defaultTopic: 'Computational Thinking, Algoritma Pemrograman & Logika Komputer',
    subtopics: 'Dekomposisi Masalah, Pengenalan Pola, Logika If-Else & Looping, serta Keamanan Siber Dasar',
    objectives: 'Mengasah cara berpikir algoritmik sistematis untuk memecahkan masalah kompleks secara terstruktur.',
    competencies: 'Menyusun alur flowchart instruksi robot, memperbaiki logika bug (debugging) langkah karakter, dan mengenali kata sandi yang aman.',
    priorKnowledge: 'Familiar dengan penggunaan gadget dan antarmuka aplikasi komputer.'
  },
  Pancasila: {
    defaultTopic: 'Nilai-Nilai Sila Pancasila & Kewarganegaraan Bhinneka Tunggal Ika',
    subtopics: 'Makna Butir 5 Sila, Gotong Royong di Lingkungan, Hak dan Kewajiban Warga Negara, serta Toleransi Keberagaman',
    objectives: 'Menginternalisasi nilai luhur Pancasila ke dalam perilaku nyata sehari-hari di sekolah dan masyarakat.',
    competencies: 'Memilih tindakan bermusyawarah dalam konflik permainan, menjunjung toleransi antar teman berbeda latar belakang, dan menunaikan kewajiban sosial.',
    priorKnowledge: 'Hafal 5 sila Pancasila dan simbol lambang Garuda Pancasila.'
  },
  Literasi: {
    defaultTopic: 'Membaca Kritis, Analisis Berita & Narasi Kreatif',
    subtopics: 'Membedakan Fakta vs Opini, Menarik Kesimpulan Paragraf, Berpikir Kritis Melawan Hoaks, dan Menulis Cerita Petualangan',
    objectives: 'Meningkatkan daya telaah teks siswa agar mampu menyaring informasi secara kritis, mendalam, dan bertanggung jawab.',
    competencies: 'Mendeteksi argumen logis, mengidentifikasi bias pernyataan, dan menjawab soal HOTS berbasis artikel faktual.',
    priorKnowledge: 'Gemar membaca artikel atau cerita fiksi pendek.'
  },
  Numerasi: {
    defaultTopic: 'Penerapan Matematika Realistis dalam Data & Kehidupan Nyata',
    subtopics: 'Membaca Diagram Batang & Lingkaran, Estimasi Peluang Sederhana, Skala Denah Rumah, dan Perhitungan Diskon Belanja',
    objectives: 'Membiasakan siswa menggunakan angka dan data kuantitatif dalam membuat keputusan sehari-hari yang akurat.',
    competencies: 'Menginterpretasi tren data grafik, menghitung persentase diskon belanjaan kasir, dan menghitung estimasi waktu tempuh perjalanan.',
    priorKnowledge: 'Perhitungan perkalian, pembagian, dan membaca angka desimal/persen.'
  },
  'Pengetahuan Umum': {
    defaultTopic: 'Wawasan Dunia, Penemuan Bersejarah & Fenomena Menakjubkan',
    subtopics: '7 Keajaiban Dunia, Satwa Langka Dilindungi, Penemu Terkenal & Inovasinya, serta Fakta Astronomi Bintang',
    objectives: 'Memperluas cakrawala pengetahuan ensiklopedia siswa tentang keajaiban planet bumi dan peradaban manusia.',
    competencies: 'Menjodohkan penemu dengan temuannya, menebak negara asal landmark bersejarah, dan mengidentifikasi fauna khas wilayah tropis.',
    priorKnowledge: 'Minat umum pada buku ensiklopedia atau video dokumenter anak.'
  },
  'Seni dan Kreativitas': {
    defaultTopic: 'Eksplorasi Teori Warna, Nada Musik & Ragam Seni Kriya',
    subtopics: 'Warna Primer-Sekunder-Tersier, Pola Ketukan Irama Musik, Ragam Motif Batik Tradisional, dan Komposisi Desain Visual',
    objectives: 'Menstimulasi imajinasi estetika, apresiasi karya seni rupa tradisional, dan kepekaan ritme musikal.',
    competencies: 'Mencampur warna cat visual di kanvas game, menebak tangga nada do-re-mi, dan menyusun puzzle pola ornamen batik nusantara.',
    priorKnowledge: 'Mengenal warna-warna dasar dan menyukai bernyanyi atau menggambar.'
  },
  CUSTOM: {
    defaultTopic: 'Materi Pembelajaran Khusus Pengguna',
    subtopics: 'Submateri yang dapat diisi bebas sesuai silabus atau kurikulum pengajar',
    objectives: 'Mencapai tujuan instruksional spesifik yang dirumuskan oleh guru atau desainer instruksional.',
    competencies: 'Kompetensi disesuaikan dengan kebutuhan pembelajaran unik.',
    priorKnowledge: 'Pengetahuan awal peserta disesuaikan pengguna.'
  }
};

export const ALL_GENRES: { genre: GameGenre; title: string; description: string }[] = [
  { genre: 'Educational Adventure', title: 'Educational Adventure', description: 'Menjelajahi peta bertahap dengan narasi menarik dan misi pembelajaran di setiap pos.' },
  { genre: 'Quiz Adventure', title: 'Quiz Adventure', description: 'Uji wawasan melalui petualangan pos soal berantai dengan hadiah bintang dan skor kilat.' },
  { genre: 'Puzzle', title: 'Puzzle Logic', description: 'Memecahkan teka-teki logika, susun keping gambar konsep, dan koneksi pola pengetahuan.' },
  { genre: 'Matching Game', title: 'Matching Pairs', description: 'Mencocokkan konsep, istilah dan arti, atau gambar dengan pasangan yang tepat.' },
  { genre: 'Memory Game', title: 'Memory Cards', description: 'Mengingat posisi kartu informasi untuk melatih daya ingat visual dan konsentrasi.' },
  { genre: 'Platformer', title: 'Action Platformer', description: 'Melompati rintangan, mengumpulkan koin pengetahuan, dan membuka pintu level baru.' },
  { genre: 'Interactive Story', title: 'Interactive Story / Visual Novel', description: 'Cerita interaktif bercabang di mana pilihan keputusan pemain menentukan jalannya alur.' },
  { genre: 'Escape Room', title: 'Educational Escape Room', description: 'Terkunci dalam ruangan misteri sains/sejarah dan harus mencari petunjuk materi untuk keluar.' },
  { genre: 'Simulation', title: 'Simulation & Management', description: 'Mengelola lab eksperimen, toko ekonomi, atau ekosistem alam dengan hukum sebab-akibat.' },
  { genre: 'Exploration', title: 'Open World Exploration', description: 'Bebas berkeliling di peta luas mencari rahasia sains dan artifak pengetahuan tersembunyi.' },
  { genre: 'Math Adventure', title: 'Math Adventure', description: 'Mengalahkan monster angka dengan mantra kalkulasi tepat dan membuka peti aljabar.' },
  { genre: 'Science Adventure', title: 'Science Lab Adventure', description: 'Melakukan eksperimen lab virtual, merangkai sirkuit atau senyawa, dan observasi alam.' },
  { genre: 'Word Search', title: 'Word Search Quest', description: 'Menemukan kata-kata kunci materi di kotak huruf acak bertema petualangan.' },
  { genre: 'Crossword', title: 'Educational Crossword', description: 'Teka-teki silang interaktif dengan petunjuk materi pembelajaran yang mendidik.' },
  { genre: 'Logic Game', title: 'Logic & Critical Thinking', description: 'Tantangan logika deduktif, algoritma pemecahan masalah, dan teka-teki pola matematika.' },
  { genre: 'Strategy Game', title: 'Turn-Based Strategy', description: 'Mengatur sumber daya materi dan pion langkah terbaik untuk menaklukkan benteng soal.' },
  { genre: 'Board Game', title: 'Virtual Board Game', description: 'Papan permainan digital seperti monopoli edukasi atau ular tangga dengan kartu tantangan materi.' },
  { genre: 'Islamic Adventure', title: 'Petualangan Islami', description: 'Mengarungi kota Madinah kuno atau padang pasir berbekal adab, doa harian, dan hafalan mulia.' },
  { genre: 'Educational RPG', title: 'Educational RPG', description: 'Membangun karakter pahlawan cilik yang bertambah kuat seiring bertambahnya ilmu materi pelajaran.' }
];

export const ALL_MECHANICS: { mechanic: GameMechanic; label: string; description: string }[] = [
  { mechanic: 'Multiple Choice', label: 'Pilihan Ganda (A/B/C/D)', description: 'Memilih 1 opsi jawaban paling tepat dengan penjelasan instan.' },
  { mechanic: 'True or False', label: 'Benar atau Salah (True/False)', description: 'Menentukan kebenaran pernyataan fakta materi secara cepat.' },
  { mechanic: 'Drag and Drop', label: 'Tarik & Letakkan (Drag & Drop)', description: 'Menggeser objek visual ke wadah kategori atau posisi target yang benar.' },
  { mechanic: 'Matching Pairs', label: 'Menjodohkan Pasangan', description: 'Menghubungkan dua item yang saling berkaitan (kata-gambar, soal-jawaban).' },
  { mechanic: 'Fill in the Blank', label: 'Isi Titik-Titik / Isian Singkat', description: 'Melengkapi kalimat rumpang dengan kata kunci atau angka yang pas.' },
  { mechanic: 'Typing Challenge', label: 'Tantangan Mengetik Kata', description: 'Mengetik istilah materi dengan ejaan benar untuk melatih ketelitian motorik.' },
  { mechanic: 'Collect Objects', label: 'Kumpulkan Objek / Kristal Ilmu', description: 'Menjelajahi arena untuk memungut item-item sesuai kriteria soal.' },
  { mechanic: 'Arrange in Order', label: 'Urutkan Rangkaian (Sequencing)', description: 'Menyusun urutan tahapan (metamorfosis, kronologi sejarah, langkah algoritma).' },
  { mechanic: 'Solve Puzzles', label: 'Pecahkan Teka-Teki Logika', description: 'Menata kepingan atau mengurai kode sandi rahasia berbasis materi.' },
  { mechanic: 'Exploration', label: 'Eksplorasi Lingkungan', description: 'Menelusuri ruangan, hutan, atau laboratorium untuk memeriksa objek interaktif.' },
  { mechanic: 'Mission Based', label: 'Misi & Quest Bertahap', description: 'Menerima tugas dari karakter NPC dan menyelesaikan daftar misi edukasi.' },
  { mechanic: 'Obstacle Challenge', label: 'Tantangan Rintangan / Platforming', description: 'Menghindari jebakan sembari menjawab pertanyaan di pos tertentu.' },
  { mechanic: 'Simulation', label: 'Simulasi Parameter Dinamis', description: 'Mengubah nilai variabel (suhu, modal, gravitasi) dan melihat dampaknya langsung.' },
  { mechanic: 'Memory Challenge', label: 'Tantangan Ingatan Visual', description: 'Membuka kartu tertutup secara berpasangan dalam batas langkah atau waktu.' },
  { mechanic: 'Interactive Dialogue', label: 'Dialog Interaktif dengan NPC', description: 'Bercakap-cakap dengan karakter pemandu untuk mendapatkan petunjuk penting.' },
  { mechanic: 'Character Movement', label: 'Pergerakan Karakter Mandiri', description: 'Mengontrol pergerakan karakter utama dengan tombol panah/WASD/layar sentuh.' },
  { mechanic: 'Classification', label: 'Klasifikasi & Pengelompokan', description: 'Memilah benda ke dalam kelompok (herbivora vs karnivora, asam vs basa).' }
];

export const ALL_THEMES: { theme: GameTheme; title: string; desc: string; icon: string }[] = [
  { theme: 'Dunia Hewan', title: 'Dunia Hewan', desc: 'Habitat sabana, rimba safari, dan interaksi satwa lucu.', icon: '🐾' },
  { theme: 'Hutan Ajaib', title: 'Hutan Ajaib (Magic Forest)', desc: 'Pohon bercahaya, peri penjaga alam, dan mata air misteri.', icon: '🌲' },
  { theme: 'Kerajaan Fantasi', title: 'Kerajaan Fantasi', desc: 'Kastil megah, ksatria ilmu, benteng kebijaksanaan, dan naga ramah.', icon: '🏰' },
  { theme: 'Petualangan Luar Angkasa', title: 'Luar Angkasa (Space Odyssey)', desc: 'Roket penjelajah, planet orbit, stasiun galaksi, dan bintang supernova.', icon: '🚀' },
  { theme: 'Dunia Bawah Laut', title: 'Dunia Bawah Laut (Deep Ocean)', desc: 'Terumbu karang warna-warni, kapal selam cilik, dan lumba-lumba pintar.', icon: '🌊' },
  { theme: 'Zaman Dinosaurus', title: 'Zaman Dinosaurus (Prehistoric)', desc: 'Lembah purba, fosil ekskavasi, dan herbivora raksasa yang ramah.', icon: '🦖' },
  { theme: 'Kota Masa Depan', title: 'Kota Masa Depan (Cyber Metropolis)', desc: 'Mobil terbang ramah lingkungan, gedung pencakar langit berenergi surya.', icon: '🏙️' },
  { theme: 'Laboratorium Sains', title: 'Laboratorium Sains Cilik', desc: 'Tabung reaksi warna-warni, mikroskop ajaib, dan penemuan spektakuler.', icon: '🔬' },
  { theme: 'Dunia Robot', title: 'Dunia Robot & Kecerdasan Buatan', desc: 'Pabrik robot cerdas, sirkuit neon, dan asisten mekanik ramah anak.', icon: '🤖' },
  { theme: 'Lingkungan dan Alam', title: 'Lingkungan dan Alam Lestari', desc: 'Desa hijau, pertanian organik, energi angin, dan bank daur ulang sampah.', icon: '🌱' },
  { theme: 'Petualangan Islami', title: 'Petualangan Islami & Peradaban', desc: 'Kubah menara berkilau, oasis gurun pasir, dan perpustakaan Baitul Hikmah.', icon: '🕌' },
  { theme: 'Kehidupan Sehari-hari', title: 'Kehidupan Sehari-hari & Sekolah', desc: 'Rumah hangat, pasar tradisional, taman kota, dan ruang kelas ceria.', icon: '🏡' },
  { theme: 'Negeri Dongeng', title: 'Negeri Dongeng Klasik', desc: 'Pualam awan, jembatan pelangi, dan buku raksasa yang hidup.', icon: '✨' }
];

export const ALL_ART_STYLES: { style: ArtStyle; title: string; desc: string }[] = [
  { style: 'Cute Cartoon', title: 'Cute Cartoon (Ramah Anak)', desc: 'Garis bulat menggemaskan, palet warna pastel ceria, ekspresi hangat.' },
  { style: '2D Illustration', title: '2D Hand-Drawn Illustration', desc: 'Gaya ilustrasi buku cerita modern yang bersih, kaya detail dan estetik.' },
  { style: '3D Look', title: '3D Stylized (Pixar/Clay Style)', desc: 'Pencahayaan lembut volumetrik, bayangan halus, tekstur model 3D mengkilap.' },
  { style: 'Pixel Art', title: 'Pixel Art (Retro 16-Bit)', desc: 'Gaya game klasik bernostalgia dengan grid pixel tajam dan animasi retro.' },
  { style: 'Flat Design', title: 'Modern Flat & Minimalist', desc: 'Bentuk geometris bersih, ruang lega, tanpa gradien bising, sangat elegan.' },
  { style: 'Watercolor', title: 'Watercolor Storybook (Cat Air)', desc: 'Nuansa sapuan kuas cat air lembut yang menenangkan jiwa dan artistik.' },
  { style: 'Fantasy', title: 'Fantasy Adventure Epic', desc: 'Kaya kilau sihir magis, ornamen ukiran, dan atmosfer kepahlawanan megah.' },
  { style: 'Islamic Cartoon', title: 'Islamic Cartoon Aesthetic', desc: 'Karakter berbusana muslim santun, ornamen geometris islami arabesque elegan.' },
  { style: 'Futuristic', title: 'Futuristic Sci-Fi Clean', desc: 'Garis cahaya neon bersih, panel kaca transparan holo, warna teal dan cyan canggih.' },
  { style: 'Minimalist', title: 'Clean Scandinavian Minimalist', desc: 'Monokromatik terkontrol dengan aksen warna tunggal yang sangat fokus belajar.' }
];
