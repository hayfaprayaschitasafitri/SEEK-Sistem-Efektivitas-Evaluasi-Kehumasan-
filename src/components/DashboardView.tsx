import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Campaign, EffectivenessStatus, PageId } from '../types/campaign';
import {
  EFFECTIVENESS_THRESHOLD,
  evaluateCampaign,
  formatCurrencyIDR,
  formatDateId,
} from '../data/mockCampaigns';
import {
  CommunicationNetworkHeroAccent,
  CommunicationNetworkHeroPattern,
  EditorialSectionDivider,
} from './AcademicOrnaments';

interface DashboardViewProps {
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaignAndGo: (id: string, page: PageId) => void;
  onStartNewEvaluation: () => void;
  onDeleteCampaign: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  campaigns,
  activeCampaignId,
  onSelectCampaignAndGo,
  onStartNewEvaluation,
  onDeleteCampaign,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | EffectivenessStatus>('Semua');

  const evaluatedList = useMemo(() => {
    return campaigns.map((campaign) => ({
      campaign,
      evaluation: evaluateCampaign(campaign),
    }));
  }, [campaigns]);

  const stats = useMemo(() => {
    const total = evaluatedList.length;
    const efektif = evaluatedList.filter((i) => i.evaluation.status === 'Efektif').length;
    const belumEfektif = evaluatedList.filter(
      (i) => i.evaluation.status === 'Belum Efektif'
    ).length;
    const belumLengkap = evaluatedList.filter(
      (i) => i.evaluation.status === 'Belum Lengkap'
    ).length;

    const ready = evaluatedList.filter((i) => i.evaluation.siapDievaluasi);
    const avgKpi =
      ready.length > 0
        ? Number(
            (
              ready.reduce((acc, i) => acc + i.evaluation.rataRataPencapaian, 0) /
              ready.length
            ).toFixed(1)
          )
        : 0;

    const totalKpiMeasured = evaluatedList.reduce(
      (acc, i) => acc + i.campaign.kpis.length,
      0
    );

    const totalKpiAchieved = ready.reduce(
      (acc, i) => acc + i.evaluation.jumlahKpiTercapai,
      0
    );

    return {
      total,
      efektif,
      belumEfektif,
      belumLengkap,
      avgKpi,
      totalKpiMeasured,
      totalKpiAchieved,
    };
  }, [evaluatedList]);

  const filteredList = useMemo(() => {
    return evaluatedList.filter(({ campaign, evaluation }) => {
      const matchesSearch =
        campaign.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'Semua' || evaluation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [evaluatedList, searchQuery, statusFilter]);

  const renderStatusLabel = (status: EffectivenessStatus) => {
    if (status === 'Efektif') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E7E5A]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Efektif</span>
        </span>
      );
    }
    if (status === 'Belum Efektif') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B84343]">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Belum Efektif</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A66D14]">
        <Clock className="h-3.5 w-3.5" />
        <span>Belum Lengkap</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Unboxed Academic Editorial Header */}
      <section className="relative overflow-hidden border-b border-[#B8D9F5] pb-6">
        <CommunicationNetworkHeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <CommunicationNetworkHeroAccent className="pointer-events-none absolute -top-1 right-0 hidden h-36 w-[360px] opacity-45 lg:block" />
        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
              BEM Program Studi Hubungan Masyarakat dan Komunikasi Digital · Universitas Negeri Jakarta
            </p>
            <h2 className="mt-2 text-2xl leading-[1.3] font-bold tracking-[0.002em] text-[#34495E]">
              Evaluasi &amp; Pemantauan Efektivitas Kampanye Kehumasan
            </h2>
            <p className="mt-2.5 text-sm leading-[1.7] tracking-[0.008em] text-[#566B80]">
              Bandingkan rencana strategis sebelum kampanye dengan capaian KPI aktual setelah pelaksanaan secara terukur, tervalidasi, dan terdokumentasi dalam laporan evaluasi resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onStartNewEvaluation}
              className="inline-flex items-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FC4EA] whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Mulai Evaluasi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const active = evaluatedList.find(
                  (i) => i.campaign.id === activeCampaignId
                );
                const nextStep: PageId = active?.evaluation.siapDievaluasi
                  ? 'evaluasi'
                  : 'sebelum';
                onSelectCampaignAndGo(activeCampaignId, nextStep);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/70 px-4 py-2.5 text-sm leading-none font-semibold tracking-[0.012em] text-[#34495E] transition-colors hover:bg-[#FFF1B8] whitespace-nowrap"
            >
              <BarChart3 className="h-4 w-4 text-[#34495E]" />
              <span>Lanjutkan Kampanye Aktif</span>
            </button>
          </div>
        </div>

        {/* Inline Sequential Workflow Trail */}
        <div className="relative z-10 mt-5 border-t border-[#F5D77E]/65 pt-4">
          {(() => {
            const activeItem = evaluatedList.find(
              (i) => i.campaign.id === activeCampaignId
            );
            const activeCamp = activeItem?.campaign;
            const readyEval = Boolean(activeItem?.evaluation.siapDievaluasi);
            const preDone =
              activeCamp !== undefined &&
              activeCamp.nama.trim().length >= 3 &&
              activeCamp.sebelum.tujuan.trim().length >= 10 &&
              activeCamp.sebelum.targetAudiens.trim().length >= 5 &&
              Boolean(activeCamp.sebelum.periodeMulai) &&
              Boolean(activeCamp.sebelum.periodeSelesai) &&
              (activeCamp.sebelum.anggaran ?? 0) > 0 &&
              activeCamp.kpis.length > 0 &&
              activeCamp.kpis.every((k) => (k.target ?? 0) > 0 && k.nama.trim().length > 0);

            const steps = [
              { step: '01', label: 'Data Sebelum', page: 'sebelum' as PageId, unlocked: true, done: preDone },
              { step: '02', label: 'Validasi Data', page: 'validasi' as PageId, unlocked: true, done: preDone },
              { step: '03', label: 'Data Setelah', page: 'sesudah' as PageId, unlocked: preDone, done: readyEval },
              { step: '04', label: 'Evaluasi KPI', page: 'evaluasi' as PageId, unlocked: readyEval, done: readyEval },
              { step: '05', label: 'Keputusan & Perbaikan', page: 'evaluasi' as PageId, unlocked: readyEval, done: readyEval },
              { step: '06', label: 'Laporan Akhir', page: 'laporan' as PageId, unlocked: readyEval, done: Boolean(activeCamp?.laporanDisusun && readyEval) },
            ];

            return (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs leading-relaxed tracking-[0.012em]">
                <span className="font-semibold text-[#566B80]">Alur Kerja Kampanye Aktif:</span>
                {steps.map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => onSelectCampaignAndGo(activeCampaignId, item.page)}
                    className={`inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 transition-colors ${
                      item.done
                        ? 'font-semibold text-[#34495E] hover:border-[#F5D77E]'
                        : item.unlocked
                          ? 'font-medium text-[#34495E] hover:border-[#8FC4EA]'
                          : 'text-[#34495E]/45'
                    }`}
                  >
                    <span className="font-bold text-[#566B80] tabular-nums">
                      {item.step}.
                    </span>
                    <span>{item.label}</span>
                    {item.done && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7E5A]" />
                    )}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Unified 4-Column Summary Strip (instead of 4 separate identical boxes) */}
      <section className="grid grid-cols-1 divide-y divide-[#DCEEFF] rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] sm:grid-cols-2 sm:divide-y-0 sm:divide-x xl:grid-cols-4">
        <div className="p-5">
          <div className="text-xs leading-snug font-semibold tracking-[0.016em] text-[#566B80]">
            Jumlah Kampanye Terdaftar
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl leading-none font-bold tracking-[0.01em] text-[#34495E] tabular-nums">
              {stats.total}
            </span>
            <span className="text-xs tracking-[0.01em] text-[#566B80]">Program Humas</span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
            {stats.belumLengkap} menunggu kelengkapan data
          </p>
        </div>

        <div className="p-5">
          <div className="text-xs leading-snug font-semibold tracking-[0.016em] text-[#566B80]">
            Status Kampanye Efektif
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl leading-none font-bold tracking-[0.01em] text-[#1E7E5A] tabular-nums">
              {stats.efektif}
            </span>
            <span className="text-xs tracking-[0.01em] text-[#566B80] tabular-nums">
              dari {stats.efektif + stats.belumEfektif} terevaluasi
            </span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
            Standar minimal {EFFECTIVENESS_THRESHOLD}% capaian KPI
          </p>
        </div>

        <div className="bg-[#FFF1B8]/25 p-5">
          <div className="text-xs leading-snug font-semibold tracking-[0.016em] text-[#566B80]">
            Perlu Perbaikan (Belum Efektif)
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl leading-none font-bold tracking-[0.01em] text-[#B84343] tabular-nums">
              {stats.belumEfektif}
            </span>
            <span className="text-xs tracking-[0.01em] text-[#566B80]">Kampanye</span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
            Memerlukan rekomendasi perbaikan
          </p>
        </div>

        <div className="bg-[#DCEEFF]/25 p-5">
          <div className="text-xs leading-snug font-semibold tracking-[0.016em] text-[#566B80]">
            Rata-Rata Pencapaian KPI
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl leading-none font-bold tracking-[0.01em] text-[#34495E] tabular-nums">
              {stats.avgKpi}%
            </span>
            <span className="text-xs tracking-[0.01em] text-[#566B80] tabular-nums">
              {stats.totalKpiAchieved}/{stats.totalKpiMeasured} KPI tercapai
            </span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
            Agregat kampanye terevaluasi
          </p>
        </div>
      </section>

      <EditorialSectionDivider />

      {/* Chart + Effectiveness Distribution */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Perbandingan Pencapaian KPI Antar Kampanye */}
        <div className="rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5D77E]/70 pb-3.5">
            <div>
              <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
                Ringkasan Pencapaian KPI per Kampanye
              </h3>
              <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
                Rata-rata realisasi KPI terhadap target awal (batas efektivitas {EFFECTIVENESS_THRESHOLD}%)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#34495E]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#8FC4EA]" />
                Efektif (≥ {EFFECTIVENESS_THRESHOLD}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#F5D77E]" />
                Belum Efektif
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {evaluatedList.map(({ campaign, evaluation }) => {
              const barValue = evaluation.siapDievaluasi
                ? Math.min(evaluation.rataRataPencapaian, 130)
                : 0;
              const barWidthPercent = Math.round((barValue / 130) * 100);
              const thresholdLeft = Math.round((EFFECTIVENESS_THRESHOLD / 130) * 100);

              return (
                <div key={campaign.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectCampaignAndGo(
                          campaign.id,
                          evaluation.siapDievaluasi ? 'evaluasi' : 'sebelum'
                        )
                      }
                      className="truncate text-left font-semibold text-[#34495E] hover:underline"
                    >
                      {campaign.kode} — {campaign.nama || 'Kampanye Tanpa Nama'}
                    </button>
                    <span className="text-xs font-bold text-[#34495E] tabular-nums shrink-0">
                      {evaluation.siapDievaluasi
                        ? `${evaluation.rataRataPencapaian}%`
                        : 'Belum diukur'}
                    </span>
                  </div>

                  <div className="relative h-3 w-full overflow-hidden rounded-sm bg-[#DCEEFF]/55">
                    {evaluation.siapDievaluasi && (
                      <div
                        className={`h-full transition-all duration-300 ${
                          evaluation.status === 'Efektif'
                            ? 'bg-[#8FC4EA]'
                            : 'bg-[#F5D77E]'
                        }`}
                        style={{ width: `${barWidthPercent}%` }}
                      />
                    )}
                    <div
                      className="absolute inset-y-0 w-0.5 bg-[#B47B19]"
                      style={{ left: `${thresholdLeft}%` }}
                      title={`Batas Efektivitas ${EFFECTIVENESS_THRESHOLD}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Efektivitas Ringkas */}
        <div className="rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] p-6 lg:col-span-4">
          <div className="border-b border-[#F5D77E]/70 pb-3.5">
            <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
              Distribusi Status Efektivitas
            </h3>
            <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
              Proporsi hasil evaluasi seluruh kampanye
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {[
              {
                label: 'Kampanye Efektif',
                count: stats.efektif,
                color: 'bg-[#8FC4EA]',
                textColor: 'text-[#1E7E5A]',
                desc: 'Pencapaian KPI ≥ 85%',
              },
              {
                label: 'Belum Efektif',
                count: stats.belumEfektif,
                color: 'bg-[#E6A19E]',
                textColor: 'text-[#B84343]',
                desc: 'Pencapaian KPI < 85%, butuh perbaikan',
              },
              {
                label: 'Belum Lengkap',
                count: stats.belumLengkap,
                color: 'bg-[#F5D77E]',
                textColor: 'text-[#A66D14]',
                desc: 'Data pra/pasca kampanye belum final',
              },
            ].map((row) => {
              const pct =
                stats.total > 0 ? Math.round((row.count / stats.total) * 100) : 0;
              return (
                <div
                  key={row.label}
                  className="border-b border-[#DCEEFF] pb-3.5 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#34495E]">{row.label}</span>
                    <span className={`font-bold tabular-nums ${row.textColor}`}>
                      {row.count} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-sm bg-[#DCEEFF]/55">
                    <div
                      className={`h-full ${row.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#566B80]">{row.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <EditorialSectionDivider />

      {/* Campaign Table */}
      <section className="rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#F5D77E]/70 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
              Daftar Kampanye &amp; Ringkasan KPI
            </h3>
            <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
              Pilih kampanye untuk mengisi data, memvalidasi, mengevaluasi KPI, atau mencetak laporan.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#566B80]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau kode..."
                className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] py-1.5 pr-3 pl-9 text-xs text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:outline-none sm:w-52"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-[#B8D9F5] bg-[#DCEEFF]/45 p-1">
              {(['Semua', 'Efektif', 'Belum Efektif', 'Belum Lengkap'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                      statusFilter === tab
                        ? 'border border-[#F5D77E] bg-[#FFFEF8] text-[#34495E]'
                        : 'text-[#566B80] hover:text-[#34495E]'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredList.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[#34495E]">
                Tidak ada kampanye yang sesuai dengan filter atau pencarian Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('Semua');
                }}
                className="mt-3 text-xs font-bold text-[#34495E] underline underline-offset-4"
              >
                Tampilkan seluruh kampanye
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#B8D9F5] bg-[#DCEEFF]/45 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                  <th className="px-6 py-3">Kampanye</th>
                  <th className="px-4 py-3">Periode Rencana</th>
                  <th className="px-4 py-3 text-right">Anggaran Rencana</th>
                  <th className="px-4 py-3 text-right">Capaian KPI</th>
                  <th className="px-4 py-3">Status Efektivitas</th>
                  <th className="px-6 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEEFF]">
                {filteredList.map(({ campaign, evaluation }) => {
                  const isCurrent = campaign.id === activeCampaignId;
                  return (
                    <tr
                      key={campaign.id}
                      className={`transition-colors hover:bg-[#FFF1B8]/25 ${
                        isCurrent ? 'bg-[#DCEEFF]/30' : ''
                      }`}
                    >
                      <td className="px-6 py-3.5">
                        <div className="leading-snug font-bold tracking-[0.006em] text-[#34495E]">
                          {campaign.nama || 'Kampanye Baru (Belum Dinamai)'}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs leading-normal tracking-[0.01em] text-[#566B80]">
                          <span className="tabular-nums">{campaign.kode}</span>
                          <span aria-hidden="true">·</span>
                          <span>{campaign.penanggungJawab || 'Belum ditentukan'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{campaign.kpis.length} KPI</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#566B80] tabular-nums whitespace-nowrap">
                        {campaign.sebelum.periodeMulai
                          ? `${formatDateId(campaign.sebelum.periodeMulai)} – ${formatDateId(campaign.sebelum.periodeSelesai)}`
                          : 'Belum dijadwalkan'}
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs font-medium text-[#34495E] tabular-nums whitespace-nowrap">
                        {campaign.sebelum.anggaran
                          ? formatCurrencyIDR(campaign.sebelum.anggaran)
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs font-bold text-[#34495E] tabular-nums whitespace-nowrap">
                        {evaluation.siapDievaluasi
                          ? `${evaluation.rataRataPencapaian}%`
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {renderStatusLabel(evaluation.status)}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onSelectCampaignAndGo(
                                campaign.id,
                                evaluation.siapDievaluasi ? 'evaluasi' : 'sebelum'
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5]/80 px-3 py-1.5 text-xs font-bold text-[#34495E] transition-colors hover:bg-[#8FC4EA]"
                          >
                            <span>
                              {evaluation.siapDievaluasi ? 'Evaluasi' : 'Lengkapi'}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                          </button>

                          {evaluation.siapDievaluasi && (
                            <button
                              type="button"
                              onClick={() => onSelectCampaignAndGo(campaign.id, 'laporan')}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/60 px-3 py-1.5 text-xs font-semibold text-[#34495E] transition-colors hover:bg-[#FFF1B8]"
                              title="Buka Laporan Evaluasi"
                            >
                              <FileText className="h-3 w-3 text-[#34495E]" />
                              <span>Laporan</span>
                            </button>
                          )}

                          {campaigns.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteCampaign(campaign.id)}
                              className="inline-flex items-center justify-center rounded-lg p-1.5 text-[#566B80] transition-colors hover:bg-[#FDECEC] hover:text-[#B84343]"
                              title="Hapus kampanye dari simulasi"
                              aria-label={`Hapus ${campaign.nama}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};
