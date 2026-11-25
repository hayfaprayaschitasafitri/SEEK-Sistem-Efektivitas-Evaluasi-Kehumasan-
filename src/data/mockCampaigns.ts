import {
  Campaign,
  EvaluationResult,
  KpiComparisonResult,
  KpiIndicator,
  PageId,
  ValidationFieldResult,
  ValidationSummary,
} from '../types/campaign';

export const EFFECTIVENESS_THRESHOLD = 85;

export const IMPROVEMENT_OPTIONS: {
  id: string;
  judul: string;
  deskripsi: string;
}[] = [
  {
    id: 'kanal',
    judul: 'Optimalisasi & Diversifikasi Kanal Komunikasi',
    deskripsi:
      'Memperluas distribusi pesan ke kanal media digital, komunitas lokal, dan siaran pers terfokus sesuai kebiasaan konsumsi informasi target audiens.',
  },
  {
    id: 'pesan',
    judul: 'Penyempurnaan Narasi & Pesan Utama Kampanye',
    deskripsi:
      'Menyederhanakan materi komunikasi visual dan narasi kunci agar lebih relevan, mudah dipahami, dan mendorong aksi nyata audiens.',
  },
  {
    id: 'kol',
    judul: 'Penguatan Kolaborasi Media & Pemengaruh Kredibel',
    deskripsi:
      'Melibatkan jurnalis sektoral, tokoh masyarakat, dan pemimpin opini yang memiliki tingkat kepercayaan tinggi di segmen target audiens.',
  },
  {
    id: 'anggaran',
    judul: 'Realokasi Anggaran ke Aktivitas Berdampak Tinggi',
    deskripsi:
      'Mengevaluasi pos biaya produksi berbiaya besar dan mengalihkan anggaran ke aktivitas interaksi langsung serta amplifikasi media berkinerja tinggi.',
  },
  {
    id: 'monitoring',
    judul: 'Peningkatan Frekuensi Pemantauan Mingguan (Mid-Campaign)',
    deskripsi:
      'Menetapkan titik evaluasi tengah periode agar penyimpangan capaian KPI dapat segera dikoreksi sebelum kampanye berakhir.',
  },
];

export const INITIAL_SIMULATED_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-001',
    kode: 'KMP-2026-01',
    nama: 'Kampanye Literasi Digital UMKM 2026',
    penanggungJawab: 'Divisi Komunikasi Publik',
    kanalUtama: 'Media Sosial, Portal Berita & Lokakarya Komunitas',
    sebelum: {
      tujuan:
        'Meningkatkan pemahaman dan adopsi transaksi keuangan digital serta pemasaran daring bagi pelaku UMKM di 5 kota prioritas.',
      targetAudiens:
        'Pelaku usaha mikro dan kecil usia 23–48 tahun di wilayah urban dan peri-urban.',
      periodeMulai: '2026-02-01',
      periodeSelesai: '2026-04-30',
      anggaran: 185000000,
    },
    sesudah: {
      tujuan:
        'Terjadi peningkatan adopsi pembayaran digital dan kesadaran keamanan transaksi pada komunitas UMKM mitra di 5 kota.',
      targetAudiens:
        'Menjangkau 142.500 pelaku UMKM aktif melalui seri webinar, konten edukasi, dan pendampingan komunitas.',
      periodeMulai: '2026-02-01',
      periodeSelesai: '2026-04-30',
      anggaran: 178500000,
    },
    kpis: [
      {
        id: 'kpi-101',
        nama: 'Jangkauan Publikasi Digital (Reach)',
        satuan: 'Ribu Tayangan',
        target: 450,
        capaian: 528,
      },
      {
        id: 'kpi-102',
        nama: 'Sentimen Positif Pemberitaan Media',
        satuan: '%',
        target: 80,
        capaian: 89,
      },
      {
        id: 'kpi-103',
        nama: 'Partisipasi Pelaku UMKM dalam Edukasi',
        satuan: 'Peserta',
        target: 2500,
        capaian: 2940,
      },
      {
        id: 'kpi-104',
        nama: 'Liputan Media Massa Nasional & Daerah',
        satuan: 'Artikel',
        target: 35,
        capaian: 41,
      },
    ],
    perbaikanDipilih: [],
    catatanPerbaikan: '',
    terakhirDiperbarui: '2026-05-05',
    laporanDisusun: true,
  },
  {
    id: 'cmp-002',
    kode: 'KMP-2026-02',
    nama: 'Sosialisasi Layanan Publik Terpadu Satu Pintu',
    penanggungJawab: 'Subbagian Hubungan Media & Informasi',
    kanalUtama: 'Siaran Pers, Radio Daerah & Kanal Video Pendek',
    sebelum: {
      tujuan:
        'Mendorong masyarakat menggunakan portal perizinan daring terpadu guna mengurangi antrean layanan tatap muka hingga 40%.',
      targetAudiens:
        'Warga pemohon layanan administrasi dan pelaku usaha lokal usia 20–55 tahun.',
      periodeMulai: '2026-05-10',
      periodeSelesai: '2026-07-31',
      anggaran: 140000000,
    },
    sesudah: {
      tujuan:
        'Kesadaran publik meningkat di wilayah pusat kota, namun tingkat aktivasi akun portal layanan daring di kecamatan pinggiran masih rendah.',
      targetAudiens:
        'Menjangkau 68.000 warga, dengan konsentrasi tertinggi pada kelompok usia 25–35 tahun di pusat kota.',
      periodeMulai: '2026-05-15',
      periodeSelesai: '2026-08-10',
      anggaran: 152000000,
    },
    kpis: [
      {
        id: 'kpi-201',
        nama: 'Tingkat Pemahaman Alur Layanan Daring',
        satuan: '%',
        target: 85,
        capaian: 64,
      },
      {
        id: 'kpi-202',
        nama: 'Registrasi Akun Portal Layanan',
        satuan: 'Pengguna',
        target: 12000,
        capaian: 7850,
      },
      {
        id: 'kpi-203',
        nama: 'Tingkat Interaksi Konten Panduan (Engagement)',
        satuan: '%',
        target: 6.5,
        capaian: 4.8,
      },
      {
        id: 'kpi-204',
        nama: 'Publikasi Siaran Pers di Media Lokal',
        satuan: 'Artikel',
        target: 24,
        capaian: 19,
      },
    ],
    perbaikanDipilih: ['kanal', 'pesan', 'monitoring'],
    catatanPerbaikan:
      'Materi video panduan perlu dibuat dalam format infografis ringkas dan disebarluaskan melalui forum RT/RW serta kanal layanan kecamatan.',
    terakhirDiperbarui: '2026-08-14',
    laporanDisusun: true,
  },
  {
    id: 'cmp-003',
    kode: 'KMP-2026-03',
    nama: 'Peluncuran Program Beasiswa Talenta Daerah',
    penanggungJawab: 'Tim Komunikasi Strategis',
    kanalUtama: 'Konferensi Pers, Kemitraan Kampus & Instagram',
    sebelum: {
      tujuan:
        'Memperluas informasi pendaftaran beasiswa pendidikan tinggi secara merata dan meningkatkan kualitas pendaftar dari seluruh kabupaten.',
      targetAudiens:
        'Siswa SMA/SMK kelas akhir, mahasiswa tingkat awal, dan orang tua wali.',
      periodeMulai: '2026-08-01',
      periodeSelesai: '2026-09-30',
      anggaran: 115000000,
    },
    sesudah: {
      tujuan:
        'Informasi pendaftaran menjangkau 100% kabupaten sasaran dan jumlah pendaftar memenuhi kualifikasi meningkat signifikan.',
      targetAudiens:
        'Menjangkau 94.000 calon pendaftar dan tenaga pendidik melalui roadshow daring dan media sosial.',
      periodeMulai: '2026-08-01',
      periodeSelesai: '2026-09-30',
      anggaran: 109200000,
    },
    kpis: [
      {
        id: 'kpi-301',
        nama: 'Jumlah Pendaftar Beasiswa Terverifikasi',
        satuan: 'Pendaftar',
        target: 4000,
        capaian: 4420,
      },
      {
        id: 'kpi-302',
        nama: 'Sebaran Pendaftar Lintas Kabupaten',
        satuan: '%',
        target: 90,
        capaian: 96,
      },
      {
        id: 'kpi-303',
        nama: 'Sentimen Positif Percakapan Publik',
        satuan: '%',
        target: 82,
        capaian: 87,
      },
    ],
    perbaikanDipilih: [],
    catatanPerbaikan: '',
    terakhirDiperbarui: '2026-10-04',
    laporanDisusun: true,
  },
  {
    id: 'cmp-004',
    kode: 'KMP-2026-04',
    nama: 'Kampanye Pengurangan Sampah Plastik Instansi',
    penanggungJawab: 'Unit Humas Internal & Keberlanjutan',
    kanalUtama: 'Media Internal, Poster Digital & Townhall',
    sebelum: {
      tujuan:
        'Mengurangi penggunaan kemasan plastik sekali pakai di lingkungan kerja melalui edukasi kebiasaan bawa wadah guna ulang.',
      targetAudiens:
        'Seluruh pegawai tetap, tenaga kontrak, dan mitra kantin di kompleks perkantoran.',
      periodeMulai: '2026-11-01',
      periodeSelesai: '',
      anggaran: null,
    },
    sesudah: {
      tujuan: '',
      targetAudiens: '',
      periodeMulai: '',
      periodeSelesai: '',
      anggaran: null,
    },
    kpis: [
      {
        id: 'kpi-401',
        nama: 'Partisipasi Pegawai dalam Program Tanpa Plastik',
        satuan: '%',
        target: 75,
        capaian: null,
      },
      {
        id: 'kpi-402',
        nama: 'Kepatuhan Mitra Kantin Menggunakan Wadah Ramah Lingkungan',
        satuan: '%',
        target: null,
        capaian: null,
      },
    ],
    perbaikanDipilih: [],
    catatanPerbaikan: '',
    terakhirDiperbarui: '2026-11-18',
    laporanDisusun: false,
  },
];

export function createBlankCampaign(sequenceNumber: number): Campaign {
  const padded = String(sequenceNumber).padStart(2, '0');
  return {
    id: `cmp-${Date.now()}`,
    kode: `KMP-2026-${padded}`,
    nama: '',
    penanggungJawab: '',
    kanalUtama: '',
    sebelum: {
      tujuan: '',
      targetAudiens: '',
      periodeMulai: '',
      periodeSelesai: '',
      anggaran: null,
    },
    sesudah: {
      tujuan: '',
      targetAudiens: '',
      periodeMulai: '',
      periodeSelesai: '',
      anggaran: null,
    },
    kpis: [
      {
        id: `kpi-${Date.now()}-1`,
        nama: 'Jangkauan Publikasi (Reach)',
        satuan: 'Ribu Tayangan',
        target: null,
        capaian: null,
      },
      {
        id: `kpi-${Date.now()}-2`,
        nama: 'Sentimen Positif Pemberitaan',
        satuan: '%',
        target: null,
        capaian: null,
      },
    ],
    perbaikanDipilih: [],
    catatanPerbaikan: '',
    terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    laporanDisusun: false,
  };
}

export function validatePreCampaign(campaign: Campaign): ValidationSummary {
  const fields: ValidationFieldResult[] = [];

  fields.push({
    key: 'nama',
    label: 'Nama Kampanye',
    valid: campaign.nama.trim().length >= 3,
    message:
      campaign.nama.trim().length >= 3
        ? 'Nama kampanye telah terisi dengan jelas.'
        : 'Nama kampanye wajib diisi (minimal 3 karakter).',
    section: 'sebelum',
  });

  fields.push({
    key: 'tujuan',
    label: 'Tujuan Kampanye',
    valid: campaign.sebelum.tujuan.trim().length >= 10,
    message:
      campaign.sebelum.tujuan.trim().length >= 10
        ? 'Tujuan kampanye sebelum pelaksanaan sudah lengkap.'
        : 'Tujuan kampanye wajib diisi dengan jelas (minimal 10 karakter).',
    section: 'sebelum',
  });

  fields.push({
    key: 'targetAudiens',
    label: 'Target Audiens',
    valid: campaign.sebelum.targetAudiens.trim().length >= 5,
    message:
      campaign.sebelum.targetAudiens.trim().length >= 5
        ? 'Segmentasi target audiens telah ditentukan.'
        : 'Target audiens wajib diisi agar evaluasi jangkauan dapat diukur.',
    section: 'sebelum',
  });

  const hasValidDates =
    Boolean(campaign.sebelum.periodeMulai) &&
    Boolean(campaign.sebelum.periodeSelesai) &&
    campaign.sebelum.periodeMulai <= campaign.sebelum.periodeSelesai;

  fields.push({
    key: 'periode',
    label: 'Periode Kampanye',
    valid: hasValidDates,
    message: hasValidDates
      ? `Periode terdefinisi (${formatDateId(campaign.sebelum.periodeMulai)} – ${formatDateId(campaign.sebelum.periodeSelesai)}).`
      : 'Tanggal mulai dan tanggal selesai kampanye wajib diisi dengan urutan yang valid.',
    section: 'sebelum',
  });

  const hasValidBudget =
    campaign.sebelum.anggaran !== null && campaign.sebelum.anggaran > 0;

  fields.push({
    key: 'anggaran',
    label: 'Anggaran Kampanye',
    valid: hasValidBudget,
    message: hasValidBudget
      ? `Anggaran rencana tercatat (${formatCurrencyIDR(campaign.sebelum.anggaran ?? 0)}).`
      : 'Anggaran kampanye wajib diisi dengan nilai lebih dari Rp 0.',
    section: 'sebelum',
  });

  const allKpisValid =
    campaign.kpis.length > 0 &&
    campaign.kpis.every(
      (k) =>
        k.nama.trim().length > 0 &&
        k.satuan.trim().length > 0 &&
        k.target !== null &&
        k.target > 0
    );

  fields.push({
    key: 'kpis',
    label: 'Penetapan KPI Sebelum Kampanye',
    valid: allKpisValid,
    message: allKpisValid
      ? `${campaign.kpis.length} indikator KPI beserta targetnya telah lengkap.`
      : 'Minimal 1 indikator KPI harus memiliki nama, satuan, dan nilai target (> 0).',
    section: 'kpi',
  });

  const completedCount = fields.filter((f) => f.valid).length;
  return {
    isValid: completedCount === fields.length,
    completedCount,
    totalCount: fields.length,
    fields,
  };
}

export function validatePostCampaign(campaign: Campaign): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (campaign.sesudah.tujuan.trim().length < 5) {
    missingFields.push('Capaian tujuan kampanye setelah pelaksanaan');
  }
  if (campaign.sesudah.targetAudiens.trim().length < 5) {
    missingFields.push('Target audiens yang berhasil dijangkau');
  }
  if (
    !campaign.sesudah.periodeMulai ||
    !campaign.sesudah.periodeSelesai ||
    campaign.sesudah.periodeMulai > campaign.sesudah.periodeSelesai
  ) {
    missingFields.push('Periode pelaksanaan aktual kampanye');
  }
  if (campaign.sesudah.anggaran === null || campaign.sesudah.anggaran <= 0) {
    missingFields.push('Realisasi anggaran kampanye');
  }
  const hasMissingKpi = campaign.kpis.some(
    (k) => k.capaian === null || Number.isNaN(k.capaian) || k.capaian < 0
  );
  if (campaign.kpis.length === 0 || hasMissingKpi) {
    missingFields.push('Capaian aktual untuk seluruh indikator KPI');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

export interface WorkflowAccess {
  sebelumUnlocked: boolean;
  validasiUnlocked: boolean;
  sesudahUnlocked: boolean;
  evaluasiUnlocked: boolean;
  laporanUnlocked: boolean;
  preValid: boolean;
  postValid: boolean;
  evaluationReady: boolean;
}

export function getWorkflowAccess(campaign: Campaign): WorkflowAccess {
  const preValid = validatePreCampaign(campaign).isValid;
  const postValid = validatePostCampaign(campaign).isValid;
  const evaluationReady = preValid && postValid;

  return {
    sebelumUnlocked: true,
    validasiUnlocked: true,
    sesudahUnlocked: preValid,
    evaluasiUnlocked: evaluationReady,
    laporanUnlocked: evaluationReady,
    preValid,
    postValid,
    evaluationReady,
  };
}

export function isPageUnlocked(campaign: Campaign, page: PageId): boolean {
  const access = getWorkflowAccess(campaign);
  switch (page) {
    case 'dashboard':
      return true;
    case 'sebelum':
      return access.sebelumUnlocked;
    case 'validasi':
      return access.validasiUnlocked;
    case 'sesudah':
      return access.sesudahUnlocked;
    case 'evaluasi':
      return access.evaluasiUnlocked;
    case 'laporan':
      return access.laporanUnlocked;
  }
}

export function getKpiIndicator(persentase: number): KpiIndicator {
  if (persentase >= 100) return 'Melampaui Target';
  if (persentase >= EFFECTIVENESS_THRESHOLD) return 'Tercapai';
  if (persentase >= 65) return 'Perlu Peningkatan';
  return 'Di Bawah Target';
}

export function evaluateCampaign(campaign: Campaign): EvaluationResult {
  const preValidation = validatePreCampaign(campaign);
  const postValidation = validatePostCampaign(campaign);

  if (!preValidation.isValid || !postValidation.isValid) {
    return {
      siapDievaluasi: false,
      status: 'Belum Lengkap',
      rataRataPencapaian: 0,
      jumlahKpiTercapai: 0,
      totalKpi: campaign.kpis.length,
      efisiensiAnggaran: 0,
      selisihAnggaran: 0,
      perbandinganKpi: [],
      ringkasanKeputusan:
        'Data sebelum atau sesudah kampanye belum lengkap untuk dilakukan evaluasi efektivitas.',
    };
  }

  const perbandinganKpi: KpiComparisonResult[] = campaign.kpis.map((kpi) => {
    const target = kpi.target ?? 1;
    const capaian = kpi.capaian ?? 0;
    const selisih = Number((capaian - target).toFixed(2));
    const persentase = Number(((capaian / target) * 100).toFixed(1));
    return {
      id: kpi.id,
      nama: kpi.nama,
      satuan: kpi.satuan,
      target,
      capaian,
      selisih,
      persentase,
      indikator: getKpiIndicator(persentase),
    };
  });

  const rataRataPencapaian = Number(
    (
      perbandinganKpi.reduce((sum, item) => sum + item.persentase, 0) /
      perbandinganKpi.length
    ).toFixed(1)
  );

  const jumlahKpiTercapai = perbandinganKpi.filter(
    (item) => item.persentase >= EFFECTIVENESS_THRESHOLD
  ).length;

  const anggaranRencana = campaign.sebelum.anggaran ?? 1;
  const anggaranRealisasi = campaign.sesudah.anggaran ?? 0;
  const efisiensiAnggaran = Number(
    ((anggaranRealisasi / anggaranRencana) * 100).toFixed(1)
  );
  const selisihAnggaran = anggaranRealisasi - anggaranRencana;

  const status =
    rataRataPencapaian >= EFFECTIVENESS_THRESHOLD
      ? 'Efektif'
      : 'Belum Efektif';

  const ringkasanKeputusan =
    status === 'Efektif'
      ? `Berdasarkan perhitungan perbandingan KPI, kampanye dinyatakan EFEKTIF dengan rata-rata pencapaian ${rataRataPencapaian}% (memenuhi standar ≥ ${EFFECTIVENESS_THRESHOLD}%). Sebanyak ${jumlahKpiTercapai} dari ${perbandinganKpi.length} indikator KPI memenuhi target keberhasilan.`
      : `Berdasarkan perhitungan perbandingan KPI, kampanye dinyatakan BELUM EFEKTIF karena rata-rata pencapaian KPI sebesar ${rataRataPencapaian}% masih berada di bawah ambang batas minimal ${EFFECTIVENESS_THRESHOLD}%. Diperlukan pemilihan rekomendasi perbaikan sebelum menyusun laporan akhir.`;

  return {
    siapDievaluasi: true,
    status,
    rataRataPencapaian,
    jumlahKpiTercapai,
    totalKpi: perbandinganKpi.length,
    efisiensiAnggaran,
    selisihAnggaran,
    perbandinganKpi,
    ringkasanKeputusan,
  };
}

export function getSuggestedImprovementIds(
  evaluation: EvaluationResult
): string[] {
  if (!evaluation.siapDievaluasi || evaluation.status === 'Efektif') return [];
  const suggested = new Set<string>(['kanal', 'monitoring']);
  const lowKpis = evaluation.perbandinganKpi.filter(
    (k) => k.persentase < EFFECTIVENESS_THRESHOLD
  );
  if (lowKpis.some((k) => k.persentase < 75)) {
    suggested.add('pesan');
    suggested.add('kol');
  }
  if (evaluation.selisihAnggaran > 0) {
    suggested.add('anggaran');
  }
  return Array.from(suggested);
}

export function calculateDurationDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff >= 0 ? diff : null;
}

export function formatCurrencyIDR(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumberId(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateId(dateString: string): string {
  if (!dateString) return '—';
  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}
