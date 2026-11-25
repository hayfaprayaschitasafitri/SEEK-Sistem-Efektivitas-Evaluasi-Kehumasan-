import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  TrendingDown,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { Campaign, KpiIndicator, PageId } from '../types/campaign';
import {
  EFFECTIVENESS_THRESHOLD,
  IMPROVEMENT_OPTIONS,
  calculateDurationDays,
  evaluateCampaign,
  formatCurrencyIDR,
  formatDateId,
  formatNumberId,
  getSuggestedImprovementIds,
} from '../data/mockCampaigns';
import { EditorialSectionDivider } from './AcademicOrnaments';

interface EvaluationViewProps {
  campaign: Campaign;
  onUpdateCampaign: (updated: Campaign) => void;
  onNavigate: (page: PageId) => void;
  onGenerateReport: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  campaign,
  onUpdateCampaign,
  onNavigate,
  onGenerateReport,
}) => {
  const [hoveredKpiId, setHoveredKpiId] = useState<string | null>(null);
  const [improvementError, setImprovementError] = useState(false);

  const evaluation = evaluateCampaign(campaign);

  if (!evaluation.siapDievaluasi) {
    return (
      <div className="space-y-6">
        <div className="border-b border-[#B8D9F5] pb-5">
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 4 dari 5 · Analisis &amp; Keputusan
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Evaluasi Efektivitas Kampanye
          </h2>
        </div>

        <section className="rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/55 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#A66D14]" />
              <div>
                <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
                  Data Evaluasi Belum Lengkap
                </h3>
                <p className="mt-1.5 text-sm leading-[1.68] tracking-[0.006em] text-[#34495E]/90">
                  {evaluation.ringkasanKeputusan} Lengkapi data sebelum dan setelah kampanye untuk melihat perbandingan otomatis, grafik KPI, dan keputusan efektivitas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('sesudah')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap shrink-0"
            >
              <span>Lengkapi Data Setelah Kampanye</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  const isEffective = evaluation.status === 'Efektif';
  const weakKpis = evaluation.perbandinganKpi.filter(
    (k) => k.persentase < EFFECTIVENESS_THRESHOLD
  );

  const durasiRencana = calculateDurationDays(
    campaign.sebelum.periodeMulai,
    campaign.sebelum.periodeSelesai
  );
  const durasiAktual = calculateDurationDays(
    campaign.sesudah.periodeMulai,
    campaign.sesudah.periodeSelesai
  );
  const selisihDurasi =
    durasiRencana !== null && durasiAktual !== null
      ? durasiAktual - durasiRencana
      : null;

  const toggleImprovementOption = (optionId: string) => {
    const exists = campaign.perbaikanDipilih.includes(optionId);
    const nextList = exists
      ? campaign.perbaikanDipilih.filter((id) => id !== optionId)
      : [...campaign.perbaikanDipilih, optionId];
    onUpdateCampaign({
      ...campaign,
      perbaikanDipilih: nextList,
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
    setImprovementError(false);
  };

  const handleApplyAutoRecommendations = () => {
    const suggestedIds = getSuggestedImprovementIds(evaluation);
    const weakListText = weakKpis
      .map(
        (k) =>
          `${k.nama} (capaian ${k.persentase}%, kurang ${(
            EFFECTIVENESS_THRESHOLD - k.persentase
          ).toFixed(1)}% dari standar minimal)`
      )
      .join('; ');

    const generatedNote = weakKpis.length
      ? `Prioritas perbaikan difokuskan pada indikator di bawah standar efektivitas (${weakListText}). Lakukan evaluasi kanal, penyesuaian pesan, dan pemantauan berkala pada siklus kampanye berikutnya.`
      : campaign.catatanPerbaikan;

    onUpdateCampaign({
      ...campaign,
      perbaikanDipilih: suggestedIds,
      catatanPerbaikan: campaign.catatanPerbaikan.trim()
        ? campaign.catatanPerbaikan
        : generatedNote,
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
    setImprovementError(false);
  };

  const handleProceedToReport = () => {
    if (
      !isEffective &&
      campaign.perbaikanDipilih.length === 0 &&
      campaign.catatanPerbaikan.trim().length === 0
    ) {
      setImprovementError(true);
      return;
    }
    setImprovementError(false);
    onGenerateReport();
  };

  const renderIndicatorBadge = (indikator: KpiIndicator) => {
    switch (indikator) {
      case 'Melampaui Target':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1E7E5A]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Melampaui Target</span>
          </span>
        );
      case 'Tercapai':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#34495E]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#5899C8]" />
            <span>Tercapai</span>
          </span>
        );
      case 'Perlu Peningkatan':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#A66D14]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Perlu Peningkatan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B84343]">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Di Bawah Target</span>
          </span>
        );
    }
  };

  const maxChartPercent = Math.max(
    120,
    ...evaluation.perbandinganKpi.map((k) => Math.ceil(k.persentase / 10) * 10)
  );

  const budgetMax = Math.max(
    campaign.sebelum.anggaran ?? 1,
    campaign.sesudah.anggaran ?? 1
  );

  return (
    <div className="space-y-8">
      {/* Unboxed Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#B8D9F5] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 4 dari 5 · Analisis Perbandingan &amp; Keputusan Sistem
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Evaluasi Efektivitas: {campaign.nama}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs leading-normal tracking-[0.012em] text-[#566B80]">
            <span className="tabular-nums">{campaign.kode}</span>
            <span aria-hidden="true">·</span>
            <span>{campaign.penanggungJawab || 'Tim Humas'}</span>
            <span aria-hidden="true">·</span>
            <span>Ambang batas efektivitas ≥ {EFFECTIVENESS_THRESHOLD}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProceedToReport}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap shrink-0"
        >
          <span>Susun Laporan Evaluasi</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Automatic Rule-Based Decision Banner */}
      <section
        className={`rounded-lg border p-5 ${
          isEffective
            ? 'border-[#8FC4EA] bg-[#DCEEFF]/50'
            : 'border-[#F5D77E] bg-[#FFF1B8]/55'
        }`}
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3.5">
            {isEffective ? (
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#1E7E5A]" />
            ) : (
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-[#B84343]" />
            )}
            <div>
              <div className="flex items-center gap-1.5 text-xs leading-snug font-bold tracking-[0.018em] text-[#566B80]">
                <Calculator className="h-3.5 w-3.5 text-[#34495E]" />
                <span>Keputusan Otomatis Sistem (Berbasis Perbandingan KPI)</span>
              </div>
              <h3 className="mt-1.5 text-lg leading-[1.35] font-bold tracking-[0.006em] text-[#34495E]">
                Status Kampanye:{' '}
                <span className={isEffective ? 'text-[#1E7E5A]' : 'text-[#B84343]'}>
                  {evaluation.status}
                </span>
              </h3>
              <p className="mt-1.5 max-w-3xl text-sm leading-[1.7] tracking-[0.008em] text-[#34495E]/90">
                {evaluation.ringkasanKeputusan}
              </p>

              {/* Transparent Formula Breakdown */}
              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#F5D77E]/75 pt-2.5 text-xs leading-relaxed tracking-[0.012em] text-[#566B80] tabular-nums">
                <span>
                  Rumus: ({evaluation.perbandinganKpi.map((k) => `${k.persentase}%`).join(' + ')}) / {evaluation.totalKpi} ={' '}
                  <strong className="text-[#34495E]">{evaluation.rataRataPencapaian}%</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Aturan: {evaluation.rataRataPencapaian}%{' '}
                  {isEffective ? '≥' : '<'} {EFFECTIVENESS_THRESHOLD}% →{' '}
                  <strong className={isEffective ? 'text-[#1E7E5A]' : 'text-[#B84343]'}>
                    {evaluation.status}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 border-t border-[#F5D77E]/75 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 shrink-0">
            <div>
              <div className="text-xs font-medium text-[#566B80]">Rata-Rata KPI</div>
              <div
                className={`mt-1 text-2xl font-bold tabular-nums ${
                  isEffective ? 'text-[#1E7E5A]' : 'text-[#B84343]'
                }`}
              >
                {evaluation.rataRataPencapaian}%
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#566B80]">KPI Tercapai</div>
              <div className="mt-1 text-2xl font-bold text-[#34495E] tabular-nums">
                {evaluation.jumlahKpiTercapai}/{evaluation.totalKpi}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#566B80]">Serapan Anggaran</div>
              <div className="mt-1 text-2xl font-bold text-[#34495E] tabular-nums">
                {evaluation.efisiensiAnggaran}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Before vs After Comparison Matrix */}
      <section className="space-y-3">
        <div>
          <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
            Perbandingan Otomatis Data Sebelum dan Sesudah Kampanye
          </h3>
          <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
            Komparasi langsung seluruh parameter perencanaan (pra-kampanye) dengan realisasi aktual (pasca-kampanye).
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#B8D9F5] bg-[#DCEEFF]/45 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                <th className="w-44 px-5 py-3">Parameter</th>
                <th className="px-4 py-3">Data Sebelum (Rencana)</th>
                <th className="px-4 py-3">Data Sesudah (Realisasi)</th>
                <th className="w-48 px-5 py-3">Hasil Perbandingan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEEFF]">
              <tr>
                <td className="px-5 py-3.5 font-bold tracking-[0.006em] text-[#34495E]">
                  Tujuan Kampanye
                </td>
                <td className="px-4 py-3.5 text-xs leading-[1.68] tracking-[0.008em] text-[#566B80]">
                  {campaign.sebelum.tujuan}
                </td>
                <td className="px-4 py-3.5 text-xs leading-[1.68] tracking-[0.008em] text-[#34495E]">
                  {campaign.sesudah.tujuan}
                </td>
                <td className="px-5 py-3.5 text-xs font-bold tracking-[0.01em]">
                  <span className={isEffective ? 'text-[#1E7E5A]' : 'text-[#A66D14]'}>
                    {isEffective ? 'Selaras & Tercapai' : 'Tercapai Sebagian'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold tracking-[0.006em] text-[#34495E]">
                  Target Audiens
                </td>
                <td className="px-4 py-3.5 text-xs leading-[1.68] tracking-[0.008em] text-[#566B80]">
                  {campaign.sebelum.targetAudiens}
                </td>
                <td className="px-4 py-3.5 text-xs leading-[1.68] tracking-[0.008em] text-[#34495E]">
                  {campaign.sesudah.targetAudiens}
                </td>
                <td className="px-5 py-3.5 text-xs font-bold tracking-[0.01em] text-[#34495E]">
                  Terjangkau &amp; Terukur
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-[#34495E]">
                  Periode Kampanye
                </td>
                <td className="px-4 py-3.5 text-xs text-[#566B80] tabular-nums">
                  <div>
                    {formatDateId(campaign.sebelum.periodeMulai)} –{' '}
                    {formatDateId(campaign.sebelum.periodeSelesai)}
                  </div>
                  {durasiRencana !== null && (
                    <div className="mt-0.5 text-[#566B80]">
                      Durasi rencana: {durasiRencana} hari
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 text-xs text-[#34495E] tabular-nums">
                  <div>
                    {formatDateId(campaign.sesudah.periodeMulai)} –{' '}
                    {formatDateId(campaign.sesudah.periodeSelesai)}
                  </div>
                  {durasiAktual !== null && (
                    <div className="mt-0.5 text-[#566B80]">
                      Durasi aktual: {durasiAktual} hari
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs font-bold tabular-nums">
                  {selisihDurasi === null ? (
                    '—'
                  ) : selisihDurasi === 0 &&
                    campaign.sebelum.periodeMulai === campaign.sesudah.periodeMulai ? (
                    <span className="text-[#1E7E5A]">Tepat Jadwal (0 hari)</span>
                  ) : (
                    <span className="text-[#A66D14]">
                      Selisih durasi {selisihDurasi > 0 ? `+${selisihDurasi}` : selisihDurasi} hari
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-[#34495E]">
                  Anggaran Kampanye
                </td>
                <td className="px-4 py-3.5 text-xs font-semibold text-[#566B80] tabular-nums">
                  {formatCurrencyIDR(campaign.sebelum.anggaran)}
                </td>
                <td className="px-4 py-3.5 text-xs font-bold text-[#34495E] tabular-nums">
                  {formatCurrencyIDR(campaign.sesudah.anggaran)}
                </td>
                <td className="px-5 py-3.5 text-xs font-bold tabular-nums">
                  <span
                    className={
                      evaluation.selisihAnggaran <= 0
                        ? 'text-[#1E7E5A]'
                        : 'text-[#B84343]'
                    }
                  >
                    {evaluation.selisihAnggaran <= 0 ? 'Efisien (' : 'Lebih ('}
                    {evaluation.selisihAnggaran > 0 ? '+' : ''}
                    {formatCurrencyIDR(evaluation.selisihAnggaran)})
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual Comparison Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Grouped Comparison Chart (Normalized Index 100% = Target) */}
        <div className="rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5D77E]/70 pb-3.5">
            <div>
              <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
                Visualisasi Perbandingan Target vs Capaian KPI
              </h3>
              <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
                Indeks pencapaian aktual terhadap target (100%) dan batas efektif ({EFFECTIVENESS_THRESHOLD}%)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#34495E]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs border border-[#8FC4EA] bg-[#B8D9F5]" />
                Target
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs border border-[#6BA8D6] bg-[#8FC4EA]" />
                ≥ 100%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs border border-[#DFBC57] bg-[#F5D77E]" />
                85–99%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs border border-[#D48581] bg-[#E8A29E]" />
                &lt; 85%
              </span>
            </div>
          </div>

          <div className="mt-4">
            <svg
              viewBox="0 0 560 265"
              className="w-full overflow-visible"
              role="img"
              aria-label="Grafik batang perbandingan target dan capaian aktual KPI"
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100, 125].map((tick) => {
                if (tick > maxChartPercent) return null;
                const y = 210 - (tick / maxChartPercent) * 175;
                return (
                  <g key={tick}>
                    <line
                      x1={48}
                      y1={y}
                      x2={530}
                      y2={y}
                      stroke={tick === 100 ? '#8FC4EA' : '#DCEEFF'}
                      strokeDasharray={tick === 100 ? '4 3' : undefined}
                      strokeWidth={tick === 100 ? 1.25 : 1}
                    />
                    <text
                      x={40}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#566B80] text-[10px]"
                    >
                      {tick}%
                    </text>
                  </g>
                );
              })}

              {/* Threshold 85% line */}
              {(() => {
                const yThresh =
                  210 - (EFFECTIVENESS_THRESHOLD / maxChartPercent) * 175;
                return (
                  <g>
                    <line
                      x1={48}
                      y1={yThresh}
                      x2={530}
                      y2={yThresh}
                      stroke="#C59B27"
                      strokeDasharray="3 3"
                      strokeWidth={1.5}
                    />
                    <text
                      x={532}
                      y={yThresh + 3}
                      className="fill-[#A66D14] text-[9px] font-bold"
                    >
                      85%
                    </text>
                  </g>
                );
              })()}

              {/* Bars */}
              {evaluation.perbandinganKpi.map((item, idx) => {
                const count = evaluation.perbandinganKpi.length;
                const groupWidth = 460 / count;
                const barWidth = Math.min(30, groupWidth * 0.3);
                const centerX = 58 + idx * groupWidth + groupWidth / 2;
                const targetHeight = (100 / maxChartPercent) * 175;
                const actualHeight =
                  (Math.min(item.persentase, maxChartPercent) / maxChartPercent) *
                  175;
                const isHovered = hoveredKpiId === item.id;
                const actualFill =
                  item.persentase >= 100
                    ? '#8FC4EA'
                    : item.persentase >= EFFECTIVENESS_THRESHOLD
                      ? '#F5D77E'
                      : '#E8A29E';
                const actualStroke =
                  item.persentase >= 100
                    ? '#6BA8D6'
                    : item.persentase >= EFFECTIVENESS_THRESHOLD
                      ? '#DFBC57'
                      : '#D48581';

                return (
                  <g
                    key={item.id}
                    onMouseEnter={() => setHoveredKpiId(item.id)}
                    onMouseLeave={() => setHoveredKpiId(null)}
                    className="cursor-pointer"
                  >
                    {isHovered && (
                      <rect
                        x={centerX - barWidth - 10}
                        y={22}
                        width={barWidth * 2 + 20}
                        height={196}
                        rx={6}
                        fill="#FFF1B8"
                        opacity={0.45}
                      />
                    )}
                    {/* Target bar */}
                    <rect
                      x={centerX - barWidth - 3}
                      y={210 - targetHeight}
                      width={barWidth}
                      height={targetHeight}
                      rx={2}
                      fill="#DCEEFF"
                      stroke="#B8D9F5"
                      strokeWidth={1}
                    />
                    <text
                      x={centerX - barWidth / 2 - 3}
                      y={210 - targetHeight - 6}
                      textAnchor="middle"
                      className="fill-[#566B80] text-[9px] font-semibold"
                    >
                      100%
                    </text>

                    {/* Actual bar */}
                    <rect
                      x={centerX + 3}
                      y={210 - actualHeight}
                      width={barWidth}
                      height={actualHeight}
                      rx={2}
                      fill={actualFill}
                      stroke={actualStroke}
                      strokeWidth={1}
                    />
                    <text
                      x={centerX + 3 + barWidth / 2}
                      y={210 - actualHeight - 6}
                      textAnchor="middle"
                      className="fill-[#34495E] text-[10px] font-bold"
                    >
                      {item.persentase}%
                    </text>

                    {/* X-axis label */}
                    <text
                      x={centerX}
                      y={230}
                      textAnchor="middle"
                      className="fill-[#34495E] text-[11px] font-bold"
                    >
                      KPI {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Detail Box & Legend Mapping */}
            <div className="mt-2 border-t border-[#DCEEFF] pt-3 text-xs">
              {hoveredKpiId ? (
                (() => {
                  const found = evaluation.perbandinganKpi.find(
                    (i) => i.id === hoveredKpiId
                  );
                  return found ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFF1B8]/45 px-3 py-2 rounded-md">
                      <span className="font-bold text-[#34495E]">
                        {found.nama}
                      </span>
                      <span className="font-semibold text-[#34495E] tabular-nums">
                        Target: {formatNumberId(found.target)} {found.satuan} ·
                        Capaian: {formatNumberId(found.capaian)} {found.satuan} (
                        {found.persentase}%)
                      </span>
                    </div>
                  ) : null;
                })()
              ) : (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {evaluation.perbandinganKpi.map((k, idx) => (
                    <div
                      key={k.id}
                      className="flex items-center justify-between gap-2 text-[#566B80]"
                    >
                      <span className="truncate">
                        <strong className="text-[#34495E]">KPI {idx + 1}:</strong>{' '}
                        {k.nama}
                      </span>
                      <span className="text-[11px] font-semibold text-[#34495E] tabular-nums shrink-0">
                        {formatNumberId(k.capaian)}/{formatNumberId(k.target)} {k.satuan}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attainment Progress & Budget Realization Chart */}
        <div className="flex flex-col justify-between gap-6 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] p-6 lg:col-span-5">
          <div>
            <div className="border-b border-[#F5D77E]/70 pb-3">
              <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
                Skor Pencapaian per KPI &amp; Realisasi Anggaran
              </h3>
              <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
                Posisi setiap indikator terhadap ambang batas {EFFECTIVENESS_THRESHOLD}% dan target 100%
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {evaluation.perbandinganKpi.map((item, idx) => {
                const widthPct = Math.min(100, (item.persentase / 125) * 100);
                const thresholdPos = (EFFECTIVENESS_THRESHOLD / 125) * 100;
                const targetPos = (100 / 125) * 100;
                const barColor =
                  item.persentase >= 100
                    ? 'bg-[#8FC4EA]'
                    : item.persentase >= EFFECTIVENESS_THRESHOLD
                      ? 'bg-[#F5D77E]'
                      : 'bg-[#E8A29E]';

                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate font-semibold text-[#34495E]">
                        {idx + 1}. {item.nama}
                      </span>
                      <span className="font-bold text-[#34495E] tabular-nums shrink-0">
                        {item.persentase}%
                      </span>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-sm bg-[#DCEEFF]/55">
                      <div
                        className={`h-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${widthPct}%` }}
                      />
                      <div
                        className="absolute inset-y-0 w-0.5 bg-[#B47B19]"
                        style={{ left: `${thresholdPos}%` }}
                        title={`Ambang Batas ${EFFECTIVENESS_THRESHOLD}%`}
                      />
                      <div
                        className="absolute inset-y-0 w-0.5 bg-[#566B80]"
                        style={{ left: `${targetPos}%` }}
                        title="Target 100%"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Budget Comparison */}
          <div className="border-t border-[#F5D77E]/70 pt-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#34495E]">
              <span>Perbandingan Anggaran</span>
              <span className="text-[#566B80] tabular-nums">
                Serapan: {evaluation.efisiensiAnggaran}%
              </span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[#566B80]">
                  <span>Anggaran Rencana</span>
                  <span className="font-semibold text-[#34495E] tabular-nums">
                    {formatCurrencyIDR(campaign.sebelum.anggaran)}
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-sm bg-[#DCEEFF]/55">
                  <div
                    className="h-full bg-[#B8D9F5]"
                    style={{
                      width: `${Math.round(
                        ((campaign.sebelum.anggaran ?? 0) / budgetMax) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#566B80]">
                  <span>Anggaran Realisasi</span>
                  <span className="font-bold text-[#34495E] tabular-nums">
                    {formatCurrencyIDR(campaign.sesudah.anggaran)}
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-sm bg-[#DCEEFF]/55">
                  <div
                    className={`h-full ${
                      evaluation.selisihAnggaran <= 0
                        ? 'bg-[#F5D77E]'
                        : 'bg-[#E8A29E]'
                    }`}
                    style={{
                      width: `${Math.round(
                        ((campaign.sesudah.anggaran ?? 0) / budgetMax) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EditorialSectionDivider />

      {/* Detailed KPI Comparison Table */}
      <section className="space-y-3">
        <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
          Tabel Perbandingan Target Sebelum dan Capaian Setelah Kampanye
        </h3>

        <div className="overflow-x-auto rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#B8D9F5] bg-[#DCEEFF]/45 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                <th className="px-5 py-3">Indikator KPI</th>
                <th className="px-4 py-3 text-right">Target Sebelum</th>
                <th className="px-4 py-3 text-right">Capaian Setelah</th>
                <th className="px-4 py-3 text-right">Selisih</th>
                <th className="px-4 py-3 text-right">Pencapaian</th>
                <th className="px-5 py-3">Indikator Hasil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEEFF]">
              {evaluation.perbandinganKpi.map((row, idx) => (
                <tr key={row.id} className="hover:bg-[#FFF1B8]/25">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#34495E]">
                      {idx + 1}. {row.nama}
                    </div>
                    <div className="text-xs text-[#566B80]">Satuan: {row.satuan}</div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-[#566B80] tabular-nums whitespace-nowrap">
                    {formatNumberId(row.target)} {row.satuan}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-bold text-[#34495E] tabular-nums whitespace-nowrap">
                    {formatNumberId(row.capaian)} {row.satuan}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right text-xs font-semibold tabular-nums whitespace-nowrap ${
                      row.selisih >= 0 ? 'text-[#1E7E5A]' : 'text-[#B84343]'
                    }`}
                  >
                    {row.selisih >= 0 ? '+' : ''}
                    {formatNumberId(row.selisih)} {row.satuan}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-bold text-[#34495E] tabular-nums whitespace-nowrap">
                    {row.persentase}%
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {renderIndicatorBadge(row.indikator)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rekomendasi Perbaikan Kampanye (Mandatory when Belum Efektif) */}
      {!isEffective && (
        <section className="rounded-lg border border-[#F5D77E] bg-[#FFFEF8] p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-[#F5D77E]/70 pb-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-[#A66D14]" />
              <div>
                <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
                  Rekomendasi &amp; Opsi Perbaikan Kampanye
                </h3>
                <p className="mt-1.5 text-sm leading-[1.68] tracking-[0.006em] text-[#566B80]">
                  Status kampanye <span className="font-bold text-[#B84343]">Belum Efektif</span>. Tinjau indikator yang belum tercapai dan pilih tindakan perbaikan untuk dimasukkan ke Laporan Evaluasi.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyAutoRecommendations}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#F5D77E] bg-[#FFF1B8] px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#F5D77E]/80 whitespace-nowrap shrink-0"
            >
              <CheckSquare className="h-3.5 w-3.5 text-[#34495E]" />
              <span>Terapkan Rekomendasi Otomatis</span>
            </button>
          </div>

          {/* Weak KPI Breakdown */}
          {weakKpis.length > 0 && (
            <div className="mt-4 rounded-lg border border-[#E5B8B8] bg-[#FDECEC]/65 p-4">
              <div className="text-xs leading-snug font-bold tracking-[0.015em] text-[#B84343]">
                Indikator KPI yang Memerlukan Perbaikan ({weakKpis.length} Indikator di bawah {EFFECTIVENESS_THRESHOLD}%):
              </div>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed tracking-[0.01em] text-[#34495E]">
                {weakKpis.map((k) => (
                  <li key={k.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-[#34495E]">{k.nama}</span>
                    <span className="font-bold text-[#B84343] tabular-nums">
                      Capaian {k.persentase}% (Selisih {formatNumberId(k.selisih)} {k.satuan})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvementError && (
            <div className="mt-4 rounded-lg border border-[#E5B8B8] bg-[#FDECEC] px-4 py-3 text-xs leading-relaxed tracking-[0.01em] font-semibold text-[#B84343]">
              Pilih minimal satu opsi rekomendasi perbaikan atau isi catatan rencana perbaikan sebelum menyusun Laporan Evaluasi.
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {IMPROVEMENT_OPTIONS.map((option) => {
              const checked = campaign.perbaikanDipilih.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                    checked
                      ? 'border-[#8FC4EA] bg-[#DCEEFF]/55'
                      : 'border-[#B8D9F5] bg-[#FFFEF8] hover:bg-[#FFF1B8]/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleImprovementOption(option.id)}
                    className="mt-1 h-4 w-4 rounded border-[#8FC4EA] accent-[#8FC4EA]"
                  />
                  <div>
                    <div className="text-sm leading-snug font-bold tracking-[0.008em] text-[#34495E]">
                      {option.judul}
                    </div>
                    <p className="mt-1.5 text-xs leading-[1.65] tracking-[0.01em] text-[#566B80]">
                      {option.deskripsi}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-5">
            <label
              htmlFor="catatan-perbaikan"
              className="block text-sm font-semibold text-[#34495E]"
            >
              Catatan Rencana Perbaikan Spesifik
            </label>
            <textarea
              id="catatan-perbaikan"
              rows={3}
              value={campaign.catatanPerbaikan}
              onChange={(e) => {
                onUpdateCampaign({
                  ...campaign,
                  catatanPerbaikan: e.target.value,
                  terakhirDiperbarui: new Date().toISOString().slice(0, 10),
                });
                setImprovementError(false);
              }}
              placeholder="Tuliskan langkah perbaikan lanjutan, jadwal tindak lanjut, atau penyesuaian strategi kampanye berikutnya..."
              className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:outline-none"
            />
          </div>
        </section>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#B8D9F5] pt-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onNavigate('sesudah')}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-4 py-2.5 text-sm font-semibold text-[#34495E] transition-colors hover:bg-[#DCEEFF]/60"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Ubah Data Setelah Kampanye</span>
        </button>

        <button
          type="button"
          onClick={handleProceedToReport}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-5 py-2.5 text-sm font-bold text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap"
        >
          <span>Susun Laporan Evaluasi</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
