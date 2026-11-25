export type PageId =
  | 'dashboard'
  | 'sebelum'
  | 'validasi'
  | 'sesudah'
  | 'evaluasi'
  | 'laporan';

export type EffectivenessStatus = 'Efektif' | 'Belum Efektif' | 'Belum Lengkap';

export type KpiIndicator =
  | 'Melampaui Target'
  | 'Tercapai'
  | 'Perlu Peningkatan'
  | 'Di Bawah Target';

export interface KpiItem {
  id: string;
  nama: string;
  satuan: string;
  target: number | null;
  capaian: number | null;
}

export interface CampaignPhaseData {
  tujuan: string;
  targetAudiens: string;
  periodeMulai: string;
  periodeSelesai: string;
  anggaran: number | null;
}

export interface Campaign {
  id: string;
  kode: string;
  nama: string;
  penanggungJawab: string;
  kanalUtama: string;
  sebelum: CampaignPhaseData;
  sesudah: CampaignPhaseData;
  kpis: KpiItem[];
  perbaikanDipilih: string[];
  catatanPerbaikan: string;
  terakhirDiperbarui: string;
  laporanDisusun: boolean;
}

export interface ValidationFieldResult {
  key: string;
  label: string;
  valid: boolean;
  message: string;
  section: 'sebelum' | 'kpi';
}

export interface ValidationSummary {
  isValid: boolean;
  completedCount: number;
  totalCount: number;
  fields: ValidationFieldResult[];
}

export interface KpiComparisonResult {
  id: string;
  nama: string;
  satuan: string;
  target: number;
  capaian: number;
  selisih: number;
  persentase: number;
  indikator: KpiIndicator;
}

export interface EvaluationResult {
  siapDievaluasi: boolean;
  status: EffectivenessStatus;
  rataRataPencapaian: number;
  jumlahKpiTercapai: number;
  totalKpi: number;
  efisiensiAnggaran: number;
  selisihAnggaran: number;
  perbandinganKpi: KpiComparisonResult[];
  ringkasanKeputusan: string;
}
