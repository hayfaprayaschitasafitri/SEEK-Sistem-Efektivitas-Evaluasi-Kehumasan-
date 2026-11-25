import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Campaign, PageId } from './types/campaign';
import {
  INITIAL_SIMULATED_CAMPAIGNS,
  createBlankCampaign,
  getWorkflowAccess,
} from './data/mockCampaigns';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { WorkflowStepper } from './components/WorkflowStepper';
import { DashboardView } from './components/DashboardView';
import { PreCampaignForm } from './components/PreCampaignForm';
import { ValidationView } from './components/ValidationView';
import { PostCampaignForm } from './components/PostCampaignForm';
import { EvaluationView } from './components/EvaluationView';
import { ReportView } from './components/ReportView';

const STORAGE_KEY = 'seek_campaigns_v1';

interface ToastState {
  message: string;
  type: 'success' | 'warning';
}

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial simulated campaigns
    }
    return INITIAL_SIMULATED_CAMPAIGNS;
  });

  const [activeCampaignId, setActiveCampaignId] = useState<string>(
    () => campaigns[0]?.id ?? INITIAL_SIMULATED_CAMPAIGNS[0].id
  );
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch {
      // Ignore storage quota errors
    }
  }, [campaigns]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeCampaign = useMemo(() => {
    return (
      campaigns.find((c) => c.id === activeCampaignId) ??
      campaigns[0] ??
      INITIAL_SIMULATED_CAMPAIGNS[0]
    );
  }, [campaigns, activeCampaignId]);

  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  const navigateWithGate = (targetCampaign: Campaign, requestedPage: PageId) => {
    const access = getWorkflowAccess(targetCampaign);

    if (requestedPage === 'sesudah' && !access.sesudahUnlocked) {
      setCurrentPage('validasi');
      showToast(
        'Tahap Data Setelah Kampanye terkunci. Lengkapi dan validasi Data Sebelum Kampanye terlebih dahulu.',
        'warning'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (
      (requestedPage === 'evaluasi' || requestedPage === 'laporan') &&
      !access.preValid
    ) {
      setCurrentPage('validasi');
      showToast(
        'Tahap ini terkunci. Selesaikan Validasi Data Sebelum Kampanye terlebih dahulu.',
        'warning'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (
      (requestedPage === 'evaluasi' || requestedPage === 'laporan') &&
      !access.postValid
    ) {
      setCurrentPage('sesudah');
      showToast(
        'Lengkapi seluruh Data Setelah Kampanye dan capaian KPI sebelum masuk ke Evaluasi & Laporan.',
        'warning'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(requestedPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleStartNewEvaluation = () => {
    const newCampaign = createBlankCampaign(campaigns.length + 1);
    setCampaigns((prev) => [newCampaign, ...prev]);
    setActiveCampaignId(newCampaign.id);
    setCurrentPage('sebelum');
    showToast('Evaluasi kampanye baru dimulai. Silakan lengkapi Data Sebelum Kampanye.');
  };

  const handleSelectCampaignAndGo = (id: string, page: PageId) => {
    const target = campaigns.find((c) => c.id === id) ?? activeCampaign;
    setActiveCampaignId(target.id);
    navigateWithGate(target, page);
  };

  const handleSelectCampaignFromHeader = (id: string) => {
    const target = campaigns.find((c) => c.id === id);
    setActiveCampaignId(id);
    if (target) {
      const access = getWorkflowAccess(target);
      if (
        (currentPage === 'sesudah' && !access.sesudahUnlocked) ||
        ((currentPage === 'evaluasi' || currentPage === 'laporan') &&
          !access.evaluationReady)
      ) {
        setCurrentPage(access.preValid ? 'sesudah' : 'validasi');
        showToast(
          'Dialihkan ke tahap yang sesuai karena data kampanye yang dipilih belum lengkap.',
          'warning'
        );
        return;
      }
    }
    showToast('Kampanye aktif diperbarui.');
  };

  const handleDeleteCampaign = (id: string) => {
    if (campaigns.length <= 1) return;
    const remaining = campaigns.filter((c) => c.id !== id);
    setCampaigns(remaining);
    if (activeCampaignId === id && remaining[0]) {
      setActiveCampaignId(remaining[0].id);
    }
    showToast('Kampanye dihapus dari daftar simulasi.');
  };

  const handleResetDemoData = () => {
    setCampaigns(INITIAL_SIMULATED_CAMPAIGNS);
    setActiveCampaignId(INITIAL_SIMULATED_CAMPAIGNS[0].id);
    setCurrentPage('dashboard');
    showToast('Data simulasi kampanye dikembalikan ke kondisi awal.');
  };

  const handleNavigate = (page: PageId) => {
    navigateWithGate(activeCampaign, page);
  };

  const handleGenerateReport = () => {
    handleUpdateCampaign({
      ...activeCampaign,
      laporanDisusun: true,
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
    setCurrentPage('laporan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Laporan evaluasi telah disusun dan siap dicetak atau diunduh.');
  };

  const handleFinishReport = () => {
    handleUpdateCampaign({
      ...activeCampaign,
      laporanDisusun: true,
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Siklus evaluasi kampanye selesai dan tersimpan di Dashboard.');
  };

  return (
    <div className="flex min-h-screen bg-[#FFFEF8] text-[#34495E]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        campaigns={campaigns}
        activeCampaign={activeCampaign}
        onSelectCampaign={handleSelectCampaignFromHeader}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onResetDemoData={handleResetDemoData}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          currentPage={currentPage}
          campaigns={campaigns}
          activeCampaignId={activeCampaign.id}
          onSelectCampaign={handleSelectCampaignFromHeader}
          onStartNewEvaluation={handleStartNewEvaluation}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {currentPage !== 'dashboard' && (
            <WorkflowStepper
              campaign={activeCampaign}
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardView
              campaigns={campaigns}
              activeCampaignId={activeCampaign.id}
              onSelectCampaignAndGo={handleSelectCampaignAndGo}
              onStartNewEvaluation={handleStartNewEvaluation}
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}

          {currentPage === 'sebelum' && (
            <PreCampaignForm
              campaign={activeCampaign}
              onUpdateCampaign={handleUpdateCampaign}
              onSaveAndValidate={() => {
                setCurrentPage('validasi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Data sebelum kampanye disimpan. Menjalankan pemeriksaan validasi.');
              }}
            />
          )}

          {currentPage === 'validasi' && (
            <ValidationView
              campaign={activeCampaign}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'sesudah' && (
            <PostCampaignForm
              campaign={activeCampaign}
              onUpdateCampaign={handleUpdateCampaign}
              onNavigate={handleNavigate}
              onCompletePostCampaign={() => {
                setCurrentPage('evaluasi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Data setelah kampanye disimpan. Menghitung evaluasi efektivitas KPI.');
              }}
            />
          )}

          {currentPage === 'evaluasi' && (
            <EvaluationView
              campaign={activeCampaign}
              onUpdateCampaign={handleUpdateCampaign}
              onNavigate={handleNavigate}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {currentPage === 'laporan' && (
            <ReportView
              campaign={activeCampaign}
              onNavigate={handleNavigate}
              onFinishReport={handleFinishReport}
            />
          )}
        </main>

        <footer className="no-print mx-auto w-full max-w-[1240px] px-4 pb-6 pt-2 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-2 border-t border-[#B8D9F5] pt-4 text-xs leading-relaxed tracking-[0.012em] text-[#566B80] sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <svg
                width="22"
                height="10"
                viewBox="0 0 22 10"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <line x1="2" y1="5" x2="20" y2="5" stroke="#8FC4EA" strokeWidth="1" />
                <circle cx="3" cy="5" r="2" fill="#8FC4EA" />
                <circle cx="11" cy="5" r="1.5" fill="#34495E" opacity="0.45" />
                <circle cx="19" cy="5" r="2" fill="#B8D9F5" />
              </svg>
              <span>
                Developed by Public Relations and Digital Communication Students, Universitas Negeri Jakarta
              </span>
            </div>
            <span className="font-semibold tracking-[0.015em] text-[#34495E]/80">
              BEM Prodi Humas &amp; Komunikasi Digital · UNJ
            </span>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`no-print fixed right-5 bottom-5 z-50 flex max-w-sm items-center gap-2.5 rounded-lg border px-4 py-3 text-xs leading-relaxed tracking-[0.01em] font-bold text-[#34495E] shadow-md ${
            toast.type === 'warning'
              ? 'border-[#F5D77E] bg-[#FFF1B8]'
              : 'border-[#8FC4EA] bg-[#DCEEFF]'
          }`}
        >
          {toast.type === 'warning' ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#A66D14]" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1E7E5A]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
