import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Campaign, PageId } from '../types/campaign';
import {
  formatCurrencyIDR,
  formatDateId,
  formatNumberId,
  validatePreCampaign,
} from '../data/mockCampaigns';
import { EditorialSectionDivider } from './AcademicOrnaments';

interface ValidationViewProps {
  campaign: Campaign;
  onNavigate: (page: PageId) => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  campaign,
  onNavigate,
}) => {
  const validation = validatePreCampaign(campaign);

  return (
    <div className="space-y-6">
      {/* Unboxed Header */}
      <div className="border-b border-[#B8D9F5] pb-5">
        <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
          Tahap 2 dari 5 · Pemeriksaan Kelengkapan
        </p>
        <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
          Validasi Data Sebelum Kampanye
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-[1.68] tracking-[0.008em] text-[#566B80]">
          Sistem memeriksa kelengkapan seluruh data wajib sebelum Anda memasukkan capaian hasil setelah kampanye.
        </p>
      </div>

      {/* Validation Status Banner */}
      {validation.isValid ? (
        <section className="rounded-lg border border-[#8FC4EA] bg-[#DCEEFF]/55 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1E7E5A]" />
              <div>
                <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
                  Data Valid &amp; Lengkap ({validation.completedCount}/{validation.totalCount} Komponen Terpenuhi)
                </h3>
                <p className="mt-1.5 text-sm leading-[1.68] tracking-[0.006em] text-[#34495E]/90">
                  Seluruh data wajib pra-kampanye untuk{' '}
                  <span className="font-bold">{campaign.nama}</span> telah terisi
                  dengan benar. Anda dapat melanjutkan ke tahap pengisian Data Setelah Kampanye.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('sesudah')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap shrink-0"
            >
              <span>Lanjut ke Data Setelah Kampanye</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/60 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#B84343]" />
              <div>
                <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
                  Data Belum Lengkap ({validation.completedCount}/{validation.totalCount} Komponen Terpenuhi)
                </h3>
                <p className="mt-1.5 text-sm leading-[1.68] tracking-[0.006em] text-[#34495E]/90">
                  Harap lengkapi seluruh komponen data wajib yang masih kosong atau tidak valid sebelum melanjutkan ke tahap pasca-kampanye.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('sebelum')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5B8B8] bg-[#FDECEC] px-4 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#B84343] transition-colors hover:bg-[#FADADA] whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Lengkapi Data Sekarang</span>
            </button>
          </div>
        </section>
      )}

      {/* Checklist Detail */}
      <section className="rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
        <div className="border-b border-[#F5D77E]/70 px-6 py-3.5">
          <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
            Hasil Pemeriksaan Parameter Wajib
          </h3>
        </div>

        <ul className="divide-y divide-[#DCEEFF]">
          {validation.fields.map((field) => (
            <li
              key={field.key}
              className="flex flex-col justify-between gap-2 px-6 py-3.5 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                {field.valid ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1E7E5A]" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B84343]" />
                )}
                <div>
                  <div className="text-sm leading-snug font-bold tracking-[0.006em] text-[#34495E]">
                    {field.label}
                  </div>
                  <div
                    className={`mt-1 text-xs leading-relaxed tracking-[0.01em] ${
                      field.valid ? 'text-[#566B80]' : 'font-semibold text-[#B84343]'
                    }`}
                  >
                    {field.message}
                  </div>
                </div>
              </div>

              <div className="shrink-0 pl-7 sm:pl-0">
                {field.valid ? (
                  <span className="text-xs font-bold text-[#1E7E5A]">
                    Tervalidasi
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('sebelum')}
                    className="text-xs font-bold text-[#34495E] underline underline-offset-4 hover:text-[#566B80]"
                  >
                    Perbaiki isian
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <EditorialSectionDivider />

      {/* Preview of Pre-Campaign Data (Unboxed editorial summary) */}
      <section className="pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
            Ringkasan Data Sebelum Kampanye Terdaftar
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('sebelum')}
            className="text-xs font-bold tracking-[0.012em] text-[#34495E] underline underline-offset-4 hover:text-[#566B80]"
          >
            Ubah Data Sebelum
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-[0.015em] text-[#566B80]">Nama Kampanye</dt>
            <dd className="mt-1 leading-snug font-bold tracking-[0.006em] text-[#34495E]">
              {campaign.nama || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.015em] text-[#566B80]">Periode &amp; Anggaran</dt>
            <dd className="mt-1 text-xs leading-relaxed font-semibold tracking-[0.008em] text-[#34495E] tabular-nums">
              {campaign.sebelum.periodeMulai
                ? `${formatDateId(campaign.sebelum.periodeMulai)} – ${formatDateId(campaign.sebelum.periodeSelesai)}`
                : '—'}{' '}
              · {campaign.sebelum.anggaran ? formatCurrencyIDR(campaign.sebelum.anggaran) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.015em] text-[#566B80]">Tujuan Kampanye</dt>
            <dd className="mt-1 leading-[1.68] tracking-[0.006em] text-[#34495E]">
              {campaign.sebelum.tujuan || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.015em] text-[#566B80]">Target Audiens</dt>
            <dd className="mt-1 leading-[1.68] tracking-[0.006em] text-[#34495E]">
              {campaign.sebelum.targetAudiens || '—'}
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <div className="text-xs font-bold text-[#566B80]">
            Target KPI yang Akan Diukur ({campaign.kpis.length} Indikator)
          </div>
          <ul className="mt-2 divide-y divide-[#DCEEFF] rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
            {campaign.kpis.map((k) => (
              <li
                key={k.id}
                className="flex items-center justify-between px-4 py-2.5 text-xs"
              >
                <span className="font-semibold text-[#34495E]">
                  {k.nama || 'KPI Tanpa Nama'}
                </span>
                <span className="font-bold text-[#34495E] tabular-nums">
                  {k.target !== null
                    ? `${formatNumberId(k.target)} ${k.satuan}`
                    : 'Belum diisi'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
