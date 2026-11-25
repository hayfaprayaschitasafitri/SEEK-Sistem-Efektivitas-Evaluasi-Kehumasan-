import React from 'react';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Campaign, PageId } from '../types/campaign';
import { getWorkflowAccess } from '../data/mockCampaigns';

interface WorkflowStepperProps {
  campaign: Campaign;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  campaign,
  currentPage,
  onNavigate,
}) => {
  const access = getWorkflowAccess(campaign);

  const steps: {
    id: PageId;
    num: string;
    label: string;
    unlocked: boolean;
    completed: boolean;
  }[] = [
    {
      id: 'sebelum',
      num: '01',
      label: 'Data Sebelum',
      unlocked: access.sebelumUnlocked,
      completed: access.preValid,
    },
    {
      id: 'validasi',
      num: '02',
      label: 'Validasi Data',
      unlocked: access.validasiUnlocked,
      completed: access.preValid,
    },
    {
      id: 'sesudah',
      num: '03',
      label: 'Data Setelah',
      unlocked: access.sesudahUnlocked,
      completed: access.postValid,
    },
    {
      id: 'evaluasi',
      num: '04',
      label: 'Evaluasi & Keputusan',
      unlocked: access.evaluasiUnlocked,
      completed: access.evaluationReady,
    },
    {
      id: 'laporan',
      num: '05',
      label: 'Laporan Evaluasi',
      unlocked: access.laporanUnlocked,
      completed: campaign.laporanDisusun && access.evaluationReady,
    },
  ];

  return (
    <nav
      aria-label="Tahapan Flowchart SEEK"
      className="no-print mb-6 border-b border-[#B8D9F5] pb-4"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        {steps.map((step, index) => {
          const isActive = currentPage === step.id;
          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => onNavigate(step.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs leading-snug tracking-[0.012em] transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#8FC4EA] bg-[#B8D9F5] font-bold text-[#34495E]'
                    : step.completed && step.unlocked
                      ? 'border-[#F5D77E] bg-[#FFF1B8]/55 font-semibold text-[#34495E] hover:bg-[#FFF1B8]/85'
                      : step.unlocked
                        ? 'border-[#B8D9F5] bg-[#FFFEF8] font-medium text-[#34495E] hover:bg-[#DCEEFF]/65'
                        : 'border-transparent bg-transparent font-medium text-[#34495E]/45 hover:bg-[#DCEEFF]/30'
                }`}
                title={
                  step.unlocked
                    ? `Buka ${step.label}`
                    : `${step.label} terkunci — selesaikan validasi tahap sebelumnya`
                }
              >
                <span
                  className={`text-[11px] font-bold tracking-[0.02em] tabular-nums ${
                    isActive
                      ? 'text-[#34495E]'
                      : step.completed
                        ? 'text-[#1E7E5A]'
                        : step.unlocked
                          ? 'text-[#566B80]'
                          : 'text-[#34495E]/40'
                  }`}
                >
                  {step.num}
                </span>
                <span>{step.label}</span>
                {step.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7E5A]" />
                ) : !step.unlocked ? (
                  <Lock className="h-3 w-3 text-[#34495E]/40" />
                ) : null}
              </button>

              {index < steps.length - 1 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-[#8FC4EA]"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
