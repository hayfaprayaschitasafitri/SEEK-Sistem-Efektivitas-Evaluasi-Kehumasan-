import React from 'react';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Lock,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Campaign, PageId } from '../types/campaign';
import { evaluateCampaign, getWorkflowAccess } from '../data/mockCampaigns';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  campaigns: Campaign[];
  activeCampaign: Campaign;
  onSelectCampaign: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onResetDemoData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  campaigns,
  activeCampaign,
  onSelectCampaign,
  mobileOpen,
  onCloseMobile,
  onResetDemoData,
}) => {
  const access = getWorkflowAccess(activeCampaign);
  const evaluation = evaluateCampaign(activeCampaign);

  const navItems: {
    id: PageId;
    label: string;
    stepLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    state: 'done' | 'warning' | 'locked' | 'idle';
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      stepLabel: 'Ringkasan',
      icon: LayoutDashboard,
      state: 'idle',
    },
    {
      id: 'sebelum',
      label: 'Data Sebelum Kampanye',
      stepLabel: 'Tahap 1',
      icon: FileSpreadsheet,
      state: access.preValid ? 'done' : 'warning',
    },
    {
      id: 'validasi',
      label: 'Validasi Data',
      stepLabel: 'Tahap 2',
      icon: ShieldCheck,
      state: access.preValid ? 'done' : 'warning',
    },
    {
      id: 'sesudah',
      label: 'Data Setelah Kampanye',
      stepLabel: 'Tahap 3',
      icon: ClipboardCheck,
      state: !access.sesudahUnlocked
        ? 'locked'
        : access.postValid
          ? 'done'
          : 'idle',
    },
    {
      id: 'evaluasi',
      label: 'Evaluasi Efektivitas',
      stepLabel: 'Tahap 4',
      icon: BarChart3,
      state: !access.evaluasiUnlocked
        ? 'locked'
        : evaluation.siapDievaluasi
          ? 'done'
          : 'idle',
    },
    {
      id: 'laporan',
      label: 'Laporan Evaluasi',
      stepLabel: 'Tahap 5',
      icon: FileText,
      state: !access.laporanUnlocked
        ? 'locked'
        : activeCampaign.laporanDisusun && evaluation.siapDievaluasi
          ? 'done'
          : 'idle',
    },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#34495E]/20 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-[#B8D9F5] bg-[#DCEEFF] text-[#34495E] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
        aria-label="Navigasi Utama SEEK"
      >
        {/* Brand Header */}
        <div className="flex items-start justify-between border-b border-[#B8D9F5] px-5 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#F5D77E] bg-[#FFF1B8] text-xs font-bold tracking-[0.08em] text-[#34495E]">
                SK
              </div>
              <span className="text-xl leading-none font-bold tracking-[0.07em] text-[#34495E]">
                SEEK
              </span>
            </div>
            <p className="mt-2.5 text-xs leading-[1.55] tracking-[0.012em] text-[#566B80]">
              Sistem Evaluasi Efektivitas Kampanye Kehumasan
            </p>
            <p className="mt-1 text-[11px] leading-[1.5] tracking-[0.02em] font-semibold text-[#34495E]/85">
              BEM Prodi Humas &amp; Komunikasi Digital · UNJ
            </p>
            <svg
              width="76"
              height="8"
              viewBox="0 0 76 8"
              fill="none"
              aria-hidden="true"
              className="mt-2"
            >
              <line x1="0" y1="4" x2="72" y2="4" stroke="#8FC4EA" strokeWidth="1" />
              <circle cx="2" cy="4" r="2" fill="#8FC4EA" />
              <circle cx="26" cy="4" r="1.5" fill="#34495E" opacity="0.45" />
              <circle cx="72" cy="4" r="2" fill="#34495E" opacity="0.5" />
            </svg>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-[#34495E] hover:bg-[#B8D9F5]/60 lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Campaign Switcher */}
        <div className="border-b border-[#B8D9F5] px-4 py-3 md:hidden">
          <label
            htmlFor="mobile-campaign-select"
            className="block text-xs font-semibold text-[#566B80]"
          >
            Pilih Kampanye
          </label>
          <select
            id="mobile-campaign-select"
            value={activeCampaign.id}
            onChange={(e) => onSelectCampaign(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-2 text-xs font-medium text-[#34495E] focus:border-[#8FC4EA] focus:outline-none"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.kode} — {c.nama || 'Kampanye Baru'}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="px-3 pb-2 text-xs font-semibold tracking-[0.03em] text-[#566B80]">
            Alur Evaluasi
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isLocked = item.state === 'locked';
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm leading-snug tracking-[0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FC4EA] ${
                      isActive
                        ? 'border border-[#8FC4EA] bg-[#B8D9F5] font-bold text-[#34495E]'
                        : isLocked
                          ? 'border border-transparent font-medium text-[#34495E]/45 hover:bg-[#FFFEF8]/45 hover:text-[#34495E]/70'
                          : 'border border-transparent font-medium text-[#34495E] hover:bg-[#FFFEF8]/75'
                    }`}
                    title={
                      isLocked
                        ? `${item.label} (Terkunci — lengkapi tahap sebelumnya)`
                        : item.label
                    }
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? 'text-[#34495E]'
                            : isLocked
                              ? 'text-[#34495E]/40'
                              : 'text-[#566B80] group-hover:text-[#34495E]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.id !== 'dashboard' && (
                      <span className="ml-2 shrink-0" title={item.stepLabel}>
                        {item.state === 'done' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7E5A]" />
                        ) : item.state === 'warning' ? (
                          <AlertCircle className="h-3.5 w-3.5 text-[#A66D14]" />
                        ) : item.state === 'locked' ? (
                          <Lock className="h-3.5 w-3.5 text-[#34495E]/40" />
                        ) : (
                          <span className="block h-1.5 w-1.5 rounded-full bg-[#8FC4EA]" />
                        )}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Active Campaign Context & Demo Reset */}
        <div className="border-t border-[#B8D9F5] bg-[#FFFEF8]/60 p-4">
          <div className="text-[11px] font-semibold tracking-[0.025em] text-[#566B80]">
            Kampanye Aktif
          </div>
          <div className="mt-1 truncate text-sm leading-snug font-bold tracking-[0.008em] text-[#34495E]">
            {activeCampaign.nama || 'Kampanye Baru (Belum Dinamai)'}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs leading-normal tracking-[0.012em] text-[#566B80]">
            <span className="tabular-nums">{activeCampaign.kode}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#34495E]">{evaluation.status}</span>
          </div>

          <button
            type="button"
            onClick={onResetDemoData}
            className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-2 text-xs font-semibold tracking-[0.015em] text-[#34495E] transition-colors hover:border-[#F5D77E] hover:bg-[#FFF1B8]/60"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Data Simulasi</span>
          </button>
        </div>
      </aside>
    </>
  );
};
