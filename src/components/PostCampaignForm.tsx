import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  ShieldAlert,
} from 'lucide-react';
import { Campaign, PageId } from '../types/campaign';
import {
  formatCurrencyIDR,
  formatDateId,
  formatNumberId,
  validatePostCampaign,
  validatePreCampaign,
} from '../data/mockCampaigns';
import { EditorialSectionDivider } from './AcademicOrnaments';

interface PostCampaignFormProps {
  campaign: Campaign;
  onUpdateCampaign: (updated: Campaign) => void;
  onNavigate: (page: PageId) => void;
  onCompletePostCampaign: () => void;
}

export const PostCampaignForm: React.FC<PostCampaignFormProps> = ({
  campaign,
  onUpdateCampaign,
  onNavigate,
  onCompletePostCampaign,
}) => {
  const [showErrors, setShowErrors] = useState(false);

  const preValidation = validatePreCampaign(campaign);
  const postValidation = validatePostCampaign(campaign);

  if (!preValidation.isValid) {
    return (
      <div className="space-y-6">
        <div className="border-b border-[#B8D9F5] pb-5">
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 3 dari 5 · Realisasi Pasca-Kampanye
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Data Setelah Kampanye
          </h2>
        </div>

        <section className="rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/55 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#A66D14]" />
              <div>
                <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
                  Tahap Data Sebelum Kampanye Belum Tervalidasi
                </h3>
                <p className="mt-1.5 text-sm leading-[1.68] tracking-[0.006em] text-[#34495E]/90">
                  Sesuai alur sistem SEEK, seluruh data sebelum kampanye harus lengkap dan valid terlebih dahulu sebelum mengisi capaian setelah kampanye.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('validasi')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Periksa Validasi Data</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  const updateSesudah = (
    field: keyof Campaign['sesudah'],
    value: string | number | null
  ) => {
    onUpdateCampaign({
      ...campaign,
      sesudah: {
        ...campaign.sesudah,
        [field]: value,
      },
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const updateKpiCapaian = (id: string, value: number | null) => {
    onUpdateCampaign({
      ...campaign,
      kpis: campaign.kpis.map((item) =>
        item.id === id ? { ...item, capaian: value } : item
      ),
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const handleFillSimulation = (mode: 'efektif' | 'kurang') => {
    const multiplier = mode === 'efektif' ? 1.12 : 0.72;
    const budgetFactor = mode === 'efektif' ? 0.96 : 1.08;

    onUpdateCampaign({
      ...campaign,
      sesudah: {
        tujuan:
          mode === 'efektif'
            ? `Tujuan kampanye tercapai sesuai rencana: ${campaign.sebelum.tujuan}`
            : `Sebagian tujuan tercapai di kanal utama, namun adopsi pada kelompok sasaran pinggiran masih di bawah target awal.`,
        targetAudiens:
          mode === 'efektif'
            ? `Berhasil menjangkau seluruh segmen target (${campaign.sebelum.targetAudiens}) dengan tingkat keterlibatan tinggi.`
            : `Menjangkau sekitar 68% dari segmen target awal (${campaign.sebelum.targetAudiens}); penetrasi di segmen usia >40 tahun masih terbatas.`,
        periodeMulai: campaign.sebelum.periodeMulai,
        periodeSelesai: campaign.sebelum.periodeSelesai,
        anggaran: campaign.sebelum.anggaran
          ? Math.round(campaign.sebelum.anggaran * budgetFactor)
          : 120000000,
      },
      kpis: campaign.kpis.map((k, idx) => {
        const base = k.target ?? 100;
        const variance = idx % 2 === 0 ? multiplier : multiplier - 0.04;
        const computed =
          k.satuan === '%'
            ? Math.min(100, Number((base * variance).toFixed(1)))
            : Math.round(base * variance);
        return {
          ...k,
          capaian: computed,
        };
      }),
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
    setShowErrors(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postValidation.isValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    onCompletePostCampaign();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Unboxed Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#B8D9F5] pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 3 dari 5 · Realisasi Pasca-Kampanye
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Formulir Data Setelah Kampanye
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-[1.68] tracking-[0.008em] text-[#566B80]">
            Masukkan realisasi hasil untuk kampanye{' '}
            <span className="font-bold text-[#34495E]">{campaign.nama}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleFillSimulation('efektif')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#8FC4EA] bg-[#DCEEFF]/75 px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#B8D9F5] whitespace-nowrap"
          >
            <ClipboardCheck className="h-3.5 w-3.5 text-[#1E7E5A]" />
            <span>Simulasi Capaian Efektif</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillSimulation('kurang')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/70 px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#FFF1B8] whitespace-nowrap"
          >
            <ClipboardCheck className="h-3.5 w-3.5 text-[#B84343]" />
            <span>Simulasi Belum Efektif</span>
          </button>
        </div>
      </div>

      {showErrors && !postValidation.isValid && (
        <div className="rounded-lg border border-[#E5B8B8] bg-[#FDECEC] p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B84343]" />
            <div>
              <h3 className="text-sm leading-snug font-bold tracking-[0.006em] text-[#34495E]">
                Mohon lengkapi seluruh data setelah kampanye terlebih dahulu:
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed tracking-[0.01em] font-medium text-[#B84343]">
                {postValidation.missingFields.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cohesive Post-Campaign Form Sheet */}
      <div className="divide-y divide-[#DCEEFF] rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
        {/* Realisasi Tujuan, Audiens, Periode, Anggaran */}
        <section className="p-6">
          <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
            A. Realisasi Pelaksanaan (Setelah Kampanye)
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <label
                  htmlFor="post-tujuan"
                  className="block text-sm font-semibold text-[#34495E]"
                >
                  Tujuan Kampanye (Hasil Aktual yang Tercapai){' '}
                  <span className="text-[#B84343]">*</span>
                </label>
                <span className="text-xs text-[#566B80]">
                  Rencana: {campaign.sebelum.tujuan.slice(0, 75)}
                  {campaign.sebelum.tujuan.length > 75 ? '...' : ''}
                </span>
              </div>
              <textarea
                id="post-tujuan"
                rows={3}
                value={campaign.sesudah.tujuan}
                onChange={(e) => updateSesudah('tujuan', e.target.value)}
                placeholder="Jelaskan sejauh mana tujuan kampanye berhasil dicapai setelah pelaksanaan..."
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <label
                  htmlFor="post-audiens"
                  className="block text-sm font-semibold text-[#34495E]"
                >
                  Target Audiens (Audiens yang Terjangkau){' '}
                  <span className="text-[#B84343]">*</span>
                </label>
                <span className="text-xs text-[#566B80]">
                  Target: {campaign.sebelum.targetAudiens.slice(0, 75)}
                  {campaign.sebelum.targetAudiens.length > 75 ? '...' : ''}
                </span>
              </div>
              <textarea
                id="post-audiens"
                rows={2}
                value={campaign.sesudah.targetAudiens}
                onChange={(e) => updateSesudah('targetAudiens', e.target.value)}
                placeholder="Deskripsikan profil dan jumlah audiens nyata yang berhasil dijangkau..."
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label
                  htmlFor="post-start"
                  className="block text-sm font-semibold text-[#34495E]"
                >
                  Periode Aktual — Mulai <span className="text-[#B84343]">*</span>
                </label>
                <span className="text-xs text-[#566B80] tabular-nums">
                  Rencana: {formatDateId(campaign.sebelum.periodeMulai)}
                </span>
              </div>
              <input
                id="post-start"
                type="date"
                value={campaign.sesudah.periodeMulai}
                onChange={(e) => updateSesudah('periodeMulai', e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label
                  htmlFor="post-end"
                  className="block text-sm font-semibold text-[#34495E]"
                >
                  Periode Aktual — Selesai <span className="text-[#B84343]">*</span>
                </label>
                <span className="text-xs text-[#566B80] tabular-nums">
                  Rencana: {formatDateId(campaign.sebelum.periodeSelesai)}
                </span>
              </div>
              <input
                id="post-end"
                type="date"
                value={campaign.sesudah.periodeSelesai}
                onChange={(e) => updateSesudah('periodeSelesai', e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <label
                  htmlFor="post-anggaran"
                  className="block text-sm font-semibold text-[#34495E]"
                >
                  Anggaran Kampanye Terealisasi (IDR){' '}
                  <span className="text-[#B84343]">*</span>
                </label>
                <span className="text-xs text-[#566B80] tabular-nums">
                  Anggaran Rencana: {formatCurrencyIDR(campaign.sebelum.anggaran)}
                </span>
              </div>
              <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <input
                  id="post-anggaran"
                  type="number"
                  min={0}
                  step={500000}
                  value={campaign.sesudah.anggaran ?? ''}
                  onChange={(e) =>
                    updateSesudah(
                      'anggaran',
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }
                  placeholder="Contoh: 145000000"
                  className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none sm:max-w-xs"
                />
                <span className="text-sm font-bold text-[#34495E] tabular-nums">
                  {campaign.sesudah.anggaran
                    ? formatCurrencyIDR(campaign.sesudah.anggaran)
                    : 'Belum diisi'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Capaian KPI */}
        <section className="p-6">
          <div>
            <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
              B. Capaian KPI Setelah Kampanye <span className="text-[#B84343]">*</span>
            </h3>
            <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
              Masukkan angka realisasi aktual untuk masing-masing indikator KPI yang telah ditetapkan sebelum kampanye.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#B8D9F5] bg-[#DCEEFF]/45 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                  <th className="px-4 py-2.5">Indikator KPI</th>
                  <th className="px-4 py-2.5 text-right">Target (Sebelum)</th>
                  <th className="w-48 px-4 py-2.5">Capaian (Setelah)</th>
                  <th className="px-4 py-2.5 text-right">Estimasi Rasio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEEFF]">
                {campaign.kpis.map((kpi) => {
                  const target = kpi.target ?? 0;
                  const capaian = kpi.capaian;
                  const ratio =
                    target > 0 && capaian !== null
                      ? ((capaian / target) * 100).toFixed(1)
                      : null;

                  return (
                    <tr key={kpi.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#34495E]">{kpi.nama}</div>
                        <div className="text-xs text-[#566B80]">Satuan: {kpi.satuan}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-[#34495E] tabular-nums whitespace-nowrap">
                        {formatNumberId(kpi.target)} {kpi.satuan}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={kpi.capaian ?? ''}
                          onChange={(e) =>
                            updateKpiCapaian(
                              kpi.id,
                              e.target.value === '' ? null : Number(e.target.value)
                            )
                          }
                          placeholder="Masukkan capaian"
                          className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold tabular-nums whitespace-nowrap">
                        {ratio !== null ? (
                          <span
                            className={
                              Number(ratio) >= 85
                                ? 'text-[#1E7E5A]'
                                : 'text-[#B84343]'
                            }
                          >
                            {ratio}%
                          </span>
                        ) : (
                          <span className="text-[#566B80]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <EditorialSectionDivider />

      {/* Bottom Action Footer */}
      <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-1 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onNavigate('validasi')}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-4 py-2.5 text-sm leading-none font-semibold tracking-[0.012em] text-[#34495E] transition-colors hover:bg-[#DCEEFF]/60"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Validasi</span>
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-5 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap"
        >
          <span>Evaluasi Efektivitas Kampanye</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
