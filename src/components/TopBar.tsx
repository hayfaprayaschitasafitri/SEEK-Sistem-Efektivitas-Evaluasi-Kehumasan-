import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { Campaign, PageId } from '../types/campaign';
import { HeaderConnectionPattern } from './AcademicOrnaments';

interface TopBarProps {
  currentPage: PageId;
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onStartNewEvaluation: () => void;
  onOpenMobileMenu: () => void;
}

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: 'Dashboard Ringkasan',
  sebelum: 'Data Sebelum Kampanye',
  validasi: 'Validasi Data',
  sesudah: 'Data Setelah Kampanye',
  evaluasi: 'Evaluasi Efektivitas Kampanye',
  laporan: 'Laporan Evaluasi',
};

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onStartNewEvaluation,
  onOpenMobileMenu,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 flex h-15 items-center justify-between gap-4 overflow-hidden border-b border-[#B8D9F5] bg-[#FFFEF8] px-4 sm:px-6 lg:px-8">
      <HeaderConnectionPattern className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] text-[#34495E] hover:bg-[#DCEEFF]/60 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-center gap-2 text-sm leading-snug">
          <span className="font-bold tracking-[0.06em] text-[#34495E] whitespace-nowrap shrink-0">
            SEEK
          </span>
          <span className="text-[#D4AF37]" aria-hidden="true">
            /
          </span>
          <h1 className="truncate leading-snug font-bold tracking-[0.008em] text-[#34495E]">
            {PAGE_TITLES[currentPage]}
          </h1>
          <span
            className="hidden xl:inline-block border-l border-[#B8D9F5] pl-3 text-[11px] leading-none font-medium tracking-[0.02em] text-[#566B80] whitespace-nowrap shrink-0"
          >
            BEM Prodi Humas &amp; Komunikasi Digital · UNJ
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2">
          <label
            htmlFor="active-campaign-select"
            className="text-xs font-semibold tracking-[0.015em] text-[#566B80] whitespace-nowrap"
          >
            Kampanye:
          </label>
          <select
            id="active-campaign-select"
            value={activeCampaignId}
            onChange={(e) => onSelectCampaign(e.target.value)}
            className="max-w-[260px] truncate rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-1.5 text-xs leading-normal font-semibold tracking-[0.008em] text-[#34495E] transition-colors hover:border-[#8FC4EA] focus:border-[#8FC4EA] focus:outline-none"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.kode} — {c.nama || 'Kampanye Baru'}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onStartNewEvaluation}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FC4EA] whitespace-nowrap shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Mulai Evaluasi</span>
        </button>
      </div>
    </header>
  );
};
