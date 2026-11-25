import React from 'react';
import { ArrowRight, FileSpreadsheet, Plus, Trash2 } from 'lucide-react';
import { Campaign, KpiItem } from '../types/campaign';
import { formatCurrencyIDR } from '../data/mockCampaigns';
import { EditorialSectionDivider } from './AcademicOrnaments';

interface PreCampaignFormProps {
  campaign: Campaign;
  onUpdateCampaign: (updated: Campaign) => void;
  onSaveAndValidate: () => void;
}

export const PreCampaignForm: React.FC<PreCampaignFormProps> = ({
  campaign,
  onUpdateCampaign,
  onSaveAndValidate,
}) => {
  const updateField = (
    field: 'nama' | 'penanggungJawab' | 'kanalUtama',
    value: string
  ) => {
    onUpdateCampaign({
      ...campaign,
      [field]: value,
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const updateSebelum = (
    field: keyof Campaign['sebelum'],
    value: string | number | null
  ) => {
    onUpdateCampaign({
      ...campaign,
      sebelum: {
        ...campaign.sebelum,
        [field]: value,
      },
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const updateKpi = (
    id: string,
    field: keyof KpiItem,
    value: string | number | null
  ) => {
    onUpdateCampaign({
      ...campaign,
      kpis: campaign.kpis.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const handleAddKpi = () => {
    const newKpi: KpiItem = {
      id: `kpi-${Date.now()}`,
      nama: '',
      satuan: '%',
      target: null,
      capaian: null,
    };
    onUpdateCampaign({
      ...campaign,
      kpis: [...campaign.kpis, newKpi],
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const handleRemoveKpi = (id: string) => {
    if (campaign.kpis.length <= 1) return;
    onUpdateCampaign({
      ...campaign,
      kpis: campaign.kpis.filter((item) => item.id !== id),
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const handleFillExample = () => {
    onUpdateCampaign({
      ...campaign,
      nama: campaign.nama || 'Kampanye Edukasi Transportasi Ramah Lingkungan',
      penanggungJawab: campaign.penanggungJawab || 'Biro Humas & Layanan Publik',
      kanalUtama:
        campaign.kanalUtama || 'Media Sosial, Siaran Pers & Papan Informasi Stasiun',
      sebelum: {
        tujuan:
          'Meningkatkan kesadaran dan penggunaan transportasi umum berbasis listrik sebesar 25% di koridor utama perkotaan selama kuartal berjalan.',
        targetAudiens:
          'Pekerja komuter dan mahasiswa usia 19–45 tahun yang beraktivitas di pusat kota.',
        periodeMulai: '2026-10-01',
        periodeSelesai: '2026-11-30',
        anggaran: 125000000,
      },
      kpis: [
        {
          id: `kpi-ex-1`,
          nama: 'Jangkauan Publikasi Digital (Reach)',
          satuan: 'Ribu Tayangan',
          target: 320,
          capaian: campaign.kpis[0]?.capaian ?? null,
        },
        {
          id: `kpi-ex-2`,
          nama: 'Sentimen Positif Pemberitaan Media',
          satuan: '%',
          target: 80,
          capaian: campaign.kpis[1]?.capaian ?? null,
        },
        {
          id: `kpi-ex-3`,
          nama: 'Partisipasi Uji Coba Rute Baru',
          satuan: 'Penumpang',
          target: 5000,
          capaian: null,
        },
      ],
      terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAndValidate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Unboxed Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#B8D9F5] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 1 dari 5 · Perencanaan &amp; Baseline
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Formulir Data Sebelum Kampanye
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-[1.68] tracking-[0.008em] text-[#566B80]">
            Lengkapi parameter rencana kampanye kehumasan dan target KPI sebagai tolok ukur evaluasi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillExample}
          className="inline-flex items-center gap-2 rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/70 px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#FFF1B8] whitespace-nowrap shrink-0"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-[#34495E]" />
          <span>Isi Contoh Simulasi</span>
        </button>
      </div>

      {/* Cohesive Document-Style Form Sheet */}
      <div className="divide-y divide-[#DCEEFF] rounded-lg border border-[#B8D9F5] bg-[#FFFEF8]">
        {/* Identitas Kampanye */}
        <section className="p-6">
          <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
            A. Identitas Program Kampanye
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="campaign-name"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Nama Kampanye <span className="text-[#B84343]">*</span>
              </label>
              <input
                id="campaign-name"
                type="text"
                value={campaign.nama}
                onChange={(e) => updateField('nama', e.target.value)}
                placeholder="Contoh: Kampanye Literasi Digital UMKM 2026"
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="campaign-pic"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Unit / Penanggung Jawab
              </label>
              <input
                id="campaign-pic"
                type="text"
                value={campaign.penanggungJawab}
                onChange={(e) => updateField('penanggungJawab', e.target.value)}
                placeholder="Contoh: Divisi Komunikasi Publik"
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="campaign-channel"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Kanal Komunikasi Utama
              </label>
              <input
                id="campaign-channel"
                type="text"
                value={campaign.kanalUtama}
                onChange={(e) => updateField('kanalUtama', e.target.value)}
                placeholder="Contoh: Media Sosial, Siaran Pers & Forum Komunitas"
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Parameter Strategis Sebelum Kampanye */}
        <section className="p-6">
          <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
            B. Parameter Perencanaan (Sebelum Kampanye)
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="pre-tujuan"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Tujuan Kampanye <span className="text-[#B84343]">*</span>
              </label>
              <textarea
                id="pre-tujuan"
                rows={3}
                value={campaign.sebelum.tujuan}
                onChange={(e) => updateSebelum('tujuan', e.target.value)}
                placeholder="Jelaskan hasil komunikasi atau perubahan persepsi/perilaku yang ingin dicapai..."
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="pre-audiens"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Target Audiens <span className="text-[#B84343]">*</span>
              </label>
              <textarea
                id="pre-audiens"
                rows={2}
                value={campaign.sebelum.targetAudiens}
                onChange={(e) => updateSebelum('targetAudiens', e.target.value)}
                placeholder="Deskripsikan segmen demografis, profesi, atau wilayah kelompok sasaran..."
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="pre-start"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Periode Kampanye — Tanggal Mulai <span className="text-[#B84343]">*</span>
              </label>
              <input
                id="pre-start"
                type="date"
                value={campaign.sebelum.periodeMulai}
                onChange={(e) => updateSebelum('periodeMulai', e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="pre-end"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Periode Kampanye — Tanggal Selesai <span className="text-[#B84343]">*</span>
              </label>
              <input
                id="pre-end"
                type="date"
                value={campaign.sebelum.periodeSelesai}
                onChange={(e) => updateSebelum('periodeSelesai', e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="pre-anggaran"
                className="block text-sm font-semibold text-[#34495E]"
              >
                Anggaran Kampanye (IDR) <span className="text-[#B84343]">*</span>
              </label>
              <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <input
                  id="pre-anggaran"
                  type="number"
                  min={0}
                  step={500000}
                  value={campaign.sebelum.anggaran ?? ''}
                  onChange={(e) =>
                    updateSebelum(
                      'anggaran',
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }
                  placeholder="Contoh: 150000000"
                  className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-sm text-[#34495E] tabular-nums placeholder:text-[#566B80]/60 focus:border-[#8FC4EA] focus:ring-2 focus:ring-[#B8D9F5]/45 focus:outline-none sm:max-w-xs"
                />
                <span className="text-sm font-bold text-[#34495E] tabular-nums">
                  {campaign.sebelum.anggaran
                    ? formatCurrencyIDR(campaign.sebelum.anggaran)
                    : 'Belum diisi'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Penetapan KPI */}
        <section className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
                C. Penetapan Indikator Kinerja Utama (KPI) <span className="text-[#B84343]">*</span>
              </h3>
              <p className="mt-1 text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
                Tetapkan indikator terukur beserta target kuantitatif sebelum kampanye dimulai.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddKpi}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#8FC4EA] bg-[#DCEEFF]/70 px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#B8D9F5] whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Indikator KPI</span>
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#B8D9F5] bg-[#DCEEFF]/45 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                  <th className="px-3 py-2.5">Nama Indikator KPI</th>
                  <th className="w-40 px-3 py-2.5">Satuan</th>
                  <th className="w-44 px-3 py-2.5">Target Sebelum Kampanye</th>
                  <th className="w-16 px-3 py-2.5 text-right">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEEFF]">
                {campaign.kpis.map((kpi, idx) => (
                  <tr key={kpi.id}>
                    <td className="py-2.5 pr-3">
                      <input
                        type="text"
                        value={kpi.nama}
                        onChange={(e) => updateKpi(kpi.id, 'nama', e.target.value)}
                        placeholder={`Indikator KPI #${idx + 1}`}
                        className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-2 text-sm text-[#34495E] focus:border-[#8FC4EA] focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        value={kpi.satuan}
                        onChange={(e) => updateKpi(kpi.id, 'satuan', e.target.value)}
                        placeholder="%, Artikel, Orang"
                        className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-2 text-sm text-[#34495E] focus:border-[#8FC4EA] focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={kpi.target ?? ''}
                        onChange={(e) =>
                          updateKpi(
                            kpi.id,
                            'target',
                            e.target.value === '' ? null : Number(e.target.value)
                          )
                        }
                        placeholder="0"
                        className="w-full rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3 py-2 text-sm text-[#34495E] tabular-nums focus:border-[#8FC4EA] focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveKpi(kpi.id)}
                        disabled={campaign.kpis.length <= 1}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#566B80] transition-colors hover:bg-[#FDECEC] hover:text-[#B84343] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Hapus baris KPI"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <EditorialSectionDivider />

      {/* Bottom Action Footer */}
      <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-1 sm:flex-row sm:items-center">
        <p className="text-xs leading-relaxed tracking-[0.01em] text-[#566B80]">
          Seluruh kolom bertanda <span className="text-[#B84343]">*</span> akan diperiksa pada tahap Validasi Data.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-5 py-2.5 text-sm leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap"
        >
          <span>Simpan &amp; Validasi Data</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
