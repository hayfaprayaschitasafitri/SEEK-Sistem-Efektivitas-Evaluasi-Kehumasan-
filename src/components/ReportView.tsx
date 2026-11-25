import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Campaign, PageId } from '../types/campaign';
import {
  EFFECTIVENESS_THRESHOLD,
  IMPROVEMENT_OPTIONS,
  calculateDurationDays,
  evaluateCampaign,
  formatCurrencyIDR,
  formatDateId,
  formatNumberId,
  validatePreCampaign,
} from '../data/mockCampaigns';

interface ReportViewProps {
  campaign: Campaign;
  onNavigate: (page: PageId) => void;
  onFinishReport: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  campaign,
  onNavigate,
  onFinishReport,
}) => {
  const evaluation = evaluateCampaign(campaign);
  const preValidation = validatePreCampaign(campaign);

  if (!evaluation.siapDievaluasi) {
    return (
      <div className="space-y-6">
        <div className="border-b border-[#B8D9F5] pb-5">
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 5 dari 5 · Dokumentasi Akhir
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Laporan Evaluasi Kampanye
          </h2>
        </div>

        <section className="rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/55 p-5">
          <h3 className="text-base leading-[1.4] font-bold tracking-[0.008em] text-[#34495E]">
            Laporan Belum Dapat Disusun
          </h3>
          <p className="mt-1.5 text-sm leading-[1.68] tracking-[0.006em] text-[#34495E]/90">
            Data sebelum dan sesudah kampanye harus dilengkapi terlebih dahulu agar hasil evaluasi dapat dicetak atau diunduh.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('sebelum')}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] hover:bg-[#8FC4EA]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Data Sebelum Kampanye</span>
          </button>
        </section>
      </div>
    );
  }

  const selectedImprovements = IMPROVEMENT_OPTIONS.filter((opt) =>
    campaign.perbaikanDipilih.includes(opt.id)
  );
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Kode Kampanye',
      'Nama Kampanye',
      'Status Efektivitas',
      'Rata-Rata KPI (%)',
      'Indikator KPI',
      'Satuan',
      'Target Sebelum',
      'Capaian Setelah',
      'Selisih',
      'Pencapaian (%)',
      'Indikator Hasil',
    ];

    const rows = evaluation.perbandinganKpi.map((item) => [
      campaign.kode,
      campaign.nama,
      evaluation.status,
      evaluation.rataRataPencapaian,
      item.nama,
      item.satuan,
      item.target,
      item.capaian,
      item.selisih,
      item.persentase,
      item.indikator,
    ]);

    const escapeCsv = (val: string | number) =>
      `"${String(val).replaceAll('"', '""')}"`;

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((r) => r.map(escapeCsv).join(',')),
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-SEEK-${campaign.kode}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtmlReport = () => {
    const improvementHtml =
      evaluation.status === 'Belum Efektif' ||
      selectedImprovements.length > 0 ||
      campaign.catatanPerbaikan.trim().length > 0
        ? `
      <h2>4. Rekomendasi & Opsi Perbaikan Kampanye</h2>
      ${
        weakKpis.length > 0
          ? `<p><strong>Indikator di Bawah Standar (&lt; ${EFFECTIVENESS_THRESHOLD}%):</strong> ${weakKpis
              .map((w) => `${w.nama} (${w.persentase}%)`)
              .join(', ')}</p>`
          : ''
      }
      <ul>
        ${
          selectedImprovements.length > 0
            ? selectedImprovements
                .map((i) => `<li><strong>${i.judul}</strong>: ${i.deskripsi}</li>`)
                .join('')
            : '<li>Belum ada opsi perbaikan spesifik yang dipilih.</li>'
        }
      </ul>
      ${
        campaign.catatanPerbaikan
          ? `<p><strong>Catatan Tambahan:</strong> ${campaign.catatanPerbaikan}</p>`
          : ''
      }
    `
        : '';

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan Evaluasi SEEK - ${campaign.kode}</title>
  <style>
    body { font-family: "Times New Roman", Times, Georgia, serif; color: #34495E; background: #FFFEF8; margin: 36px; line-height: 1.68; letter-spacing: 0.006em; }
    h1 { color: #34495E; margin-bottom: 6px; line-height: 1.3; letter-spacing: 0.004em; }
    h2 { color: #34495E; border-bottom: 1px solid #F5D77E; padding-bottom: 6px; margin-top: 28px; line-height: 1.38; letter-spacing: 0.008em; }
    .meta { color: #566B80; font-size: 13px; line-height: 1.6; letter-spacing: 0.012em; margin-bottom: 20px; }
    .status { padding: 14px; border-radius: 6px; line-height: 1.65; background: ${
      evaluation.status === 'Efektif' ? '#DCEEFF' : '#FFF1B8'
    }; border: 1px solid ${
      evaluation.status === 'Efektif' ? '#8FC4EA' : '#F5D77E'
    }; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { border: 1px solid #B8D9F5; padding: 9px 11px; text-align: left; line-height: 1.6; }
    th { background: #DCEEFF; color: #34495E; letter-spacing: 0.018em; line-height: 1.4; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body>
  <h1>Laporan Evaluasi Efektivitas Kampanye Kehumasan</h1>
  <div class="meta">SEEK · BEM Program Studi Hubungan Masyarakat dan Komunikasi Digital, Universitas Negeri Jakarta · ${campaign.kode} · ${campaign.nama} · Penanggung Jawab: ${
      campaign.penanggungJawab || 'Tim Humas'
    } · Kanal: ${campaign.kanalUtama || 'Multi-kanal'}</div>
  <div class="status">
    <strong>Keputusan Otomatis Sistem: ${evaluation.status}</strong><br/>
    Rata-rata Pencapaian KPI: ${evaluation.rataRataPencapaian}% (Standar Efektivitas: &ge; ${EFFECTIVENESS_THRESHOLD}%) &middot; Serapan Anggaran: ${evaluation.efisiensiAnggaran}%<br/>
    ${evaluation.ringkasanKeputusan}
  </div>
  <h2>1. Status Validasi Kelengkapan Data</h2>
  <p>Validasi Data Sebelum Kampanye: ${preValidation.completedCount}/${preValidation.totalCount} Komponen Terpenuhi (Tervalidasi). Data Setelah Kampanye: Lengkap.</p>
  <h2>2. Perbandingan Data Sebelum & Sesudah Kampanye</h2>
  <table>
    <thead>
      <tr><th>Komponen</th><th>Sebelum Kampanye (Rencana)</th><th>Setelah Kampanye (Realisasi)</th></tr>
    </thead>
    <tbody>
      <tr><td>Tujuan Kampanye</td><td>${campaign.sebelum.tujuan}</td><td>${campaign.sesudah.tujuan}</td></tr>
      <tr><td>Target Audiens</td><td>${campaign.sebelum.targetAudiens}</td><td>${campaign.sesudah.targetAudiens}</td></tr>
      <tr><td>Periode</td><td>${formatDateId(campaign.sebelum.periodeMulai)} – ${formatDateId(campaign.sebelum.periodeSelesai)} (${durasiRencana ?? '-'} hari)</td><td>${formatDateId(campaign.sesudah.periodeMulai)} – ${formatDateId(campaign.sesudah.periodeSelesai)} (${durasiAktual ?? '-'} hari)</td></tr>
      <tr><td>Anggaran</td><td>${formatCurrencyIDR(campaign.sebelum.anggaran)}</td><td>${formatCurrencyIDR(campaign.sesudah.anggaran)} (Selisih: ${evaluation.selisihAnggaran > 0 ? '+' : ''}${formatCurrencyIDR(evaluation.selisihAnggaran)})</td></tr>
    </tbody>
  </table>
  <h2>3. Hasil Evaluasi KPI</h2>
  <table>
    <thead>
      <tr>
        <th>Indikator KPI</th><th>Target</th><th>Capaian</th><th>Selisih</th><th>Pencapaian</th><th>Indikator</th>
      </tr>
    </thead>
    <tbody>
      ${evaluation.perbandinganKpi
        .map(
          (k) => `<tr>
          <td>${k.nama} (${k.satuan})</td>
          <td class="num">${formatNumberId(k.target)}</td>
          <td class="num">${formatNumberId(k.capaian)}</td>
          <td class="num">${k.selisih >= 0 ? '+' : ''}${formatNumberId(k.selisih)}</td>
          <td class="num">${k.persentase}%</td>
          <td>${k.indikator}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
  ${improvementHtml}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Evaluasi-SEEK-${campaign.kode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isEffective = evaluation.status === 'Efektif';

  return (
    <div className="space-y-6">
      {/* Unboxed Action Toolbar (Hidden when printing) */}
      <div className="no-print flex flex-col justify-between gap-4 border-b border-[#B8D9F5] pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs leading-relaxed font-semibold tracking-[0.022em] text-[#566B80]">
            Tahap 5 dari 5 · Laporan Resmi Evaluasi
          </p>
          <h2 className="mt-1.5 text-xl leading-[1.32] font-bold tracking-[0.005em] text-[#34495E]">
            Laporan Evaluasi Efektivitas Kampanye
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-[1.68] tracking-[0.008em] text-[#566B80]">
            Dokumen komparatif lengkap dari seluruh tahapan proses evaluasi siap cetak dan unduh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('evaluasi')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-xs leading-none font-semibold tracking-[0.012em] text-[#34495E] transition-colors hover:bg-[#DCEEFF]/60 whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Evaluasi</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#DCEEFF]/60 whitespace-nowrap"
          >
            <Printer className="h-3.5 w-3.5 text-[#34495E]" />
            <span>Cetak Laporan</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#DCEEFF]/60 whitespace-nowrap"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#34495E]" />
            <span>Unduh CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadHtmlReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#F5D77E] bg-[#FFF1B8] px-3.5 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#F5D77E]/85 whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh Laporan</span>
          </button>

          <button
            type="button"
            onClick={onFinishReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#8FC4EA] bg-[#B8D9F5] px-4 py-2 text-xs leading-none font-bold tracking-[0.015em] text-[#34495E] transition-colors hover:bg-[#8FC4EA] whitespace-nowrap"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Selesai</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <article className="print-container rounded-lg border border-[#B8D9F5] bg-[#FFFEF8] p-6 sm:p-10">
        {/* Document Header */}
        <header className="flex flex-col justify-between gap-4 border-b-2 border-[#F5D77E] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs leading-relaxed font-bold tracking-[0.022em] text-[#566B80]">
              SEEK · BEM Program Studi Hubungan Masyarakat dan Komunikasi Digital, Universitas Negeri Jakarta
            </p>
            <h1 className="mt-2 text-2xl leading-[1.3] font-bold tracking-[0.004em] text-[#34495E]">
              Laporan Evaluasi Kampanye: {campaign.nama}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs leading-normal tracking-[0.012em] text-[#566B80]">
              <span className="font-bold text-[#34495E] tabular-nums">
                {campaign.kode}
              </span>
              <span aria-hidden="true">·</span>
              <span>Penanggung Jawab: {campaign.penanggungJawab || 'Tim Humas'}</span>
              <span aria-hidden="true">·</span>
              <span>Kanal: {campaign.kanalUtama || 'Multi-kanal'}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs tracking-[0.015em] text-[#566B80]">Tanggal Penyusunan</div>
            <div className="mt-0.5 text-sm leading-snug font-bold tracking-[0.008em] text-[#34495E] tabular-nums">
              {formatDateId(new Date().toISOString().slice(0, 10))}
            </div>
          </div>
        </header>

        {/* Executive Decision & Validation Summary */}
        <section
          className={`mt-6 rounded-lg border p-5 ${
            isEffective
              ? 'border-[#8FC4EA] bg-[#DCEEFF]/45'
              : 'border-[#F5D77E] bg-[#FFF1B8]/55'
          }`}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              {isEffective ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1E7E5A]" />
              ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B84343]" />
              )}
              <div>
                <div className="text-xs leading-snug font-bold tracking-[0.018em] text-[#566B80]">
                  Hasil Keputusan Otomatis Sistem (Ambang Batas ≥ {EFFECTIVENESS_THRESHOLD}%)
                </div>
                <div className="mt-1 text-lg leading-[1.35] font-bold tracking-[0.006em] text-[#34495E]">
                  Status:{' '}
                  <span className={isEffective ? 'text-[#1E7E5A]' : 'text-[#B84343]'}>
                    {evaluation.status}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-[1.7] tracking-[0.008em] text-[#34495E]/90">
                  {evaluation.ringkasanKeputusan}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs leading-normal tracking-[0.012em] text-[#566B80]">
                  <span className="inline-flex items-center gap-1 font-bold text-[#1E7E5A]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Validasi Pra-Kampanye: {preValidation.completedCount}/{preValidation.totalCount} Lengkap
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    KPI Tercapai: {evaluation.jumlahKpiTercapai}/{evaluation.totalKpi}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 border-t border-[#F5D77E]/80 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 shrink-0">
              <div>
                <div className="text-xs text-[#566B80]">Rata-Rata KPI</div>
                <div
                  className={`text-2xl font-bold tabular-nums ${
                    isEffective ? 'text-[#1E7E5A]' : 'text-[#B84343]'
                  }`}
                >
                  {evaluation.rataRataPencapaian}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#566B80]">Serapan Anggaran</div>
                <div className="text-2xl font-bold text-[#34495E] tabular-nums">
                  {evaluation.efisiensiAnggaran}%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Before vs After Comparison Table */}
        <section className="mt-8">
          <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
            1. Ringkasan Data Sebelum dan Sesudah Kampanye
          </h3>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse border border-[#B8D9F5] text-left text-sm">
              <thead>
                <tr className="bg-[#DCEEFF]/60 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                  <th className="w-40 border border-[#B8D9F5] px-4 py-3">Komponen</th>
                  <th className="border border-[#B8D9F5] px-4 py-3">
                    Data Sebelum Kampanye (Rencana)
                  </th>
                  <th className="border border-[#B8D9F5] px-4 py-3">
                    Data Setelah Kampanye (Realisasi)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#B8D9F5] bg-[#DCEEFF]/20 px-4 py-3 font-bold tracking-[0.006em] text-[#34495E]">
                    Tujuan Kampanye
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 leading-[1.68] tracking-[0.006em] text-[#566B80]">
                    {campaign.sebelum.tujuan}
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 leading-[1.68] tracking-[0.006em] text-[#34495E]">
                    {campaign.sesudah.tujuan}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#B8D9F5] bg-[#DCEEFF]/20 px-4 py-3 font-bold tracking-[0.006em] text-[#34495E]">
                    Target Audiens
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 leading-[1.68] tracking-[0.006em] text-[#566B80]">
                    {campaign.sebelum.targetAudiens}
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 leading-[1.68] tracking-[0.006em] text-[#34495E]">
                    {campaign.sesudah.targetAudiens}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#B8D9F5] bg-[#DCEEFF]/20 px-4 py-3 font-bold text-[#34495E]">
                    Periode Kampanye
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 text-xs text-[#566B80] tabular-nums">
                    {formatDateId(campaign.sebelum.periodeMulai)} –{' '}
                    {formatDateId(campaign.sebelum.periodeSelesai)}
                    {durasiRencana !== null ? ` (${durasiRencana} hari)` : ''}
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 text-xs text-[#34495E] tabular-nums">
                    {formatDateId(campaign.sesudah.periodeMulai)} –{' '}
                    {formatDateId(campaign.sesudah.periodeSelesai)}
                    {durasiAktual !== null ? ` (${durasiAktual} hari)` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#B8D9F5] bg-[#DCEEFF]/20 px-4 py-3 font-bold text-[#34495E]">
                    Anggaran Kampanye
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 text-xs font-semibold text-[#566B80] tabular-nums">
                    {formatCurrencyIDR(campaign.sebelum.anggaran)}
                  </td>
                  <td className="border border-[#B8D9F5] px-4 py-3 text-xs font-bold text-[#34495E] tabular-nums">
                    {formatCurrencyIDR(campaign.sesudah.anggaran)} (Selisih:{' '}
                    {evaluation.selisihAnggaran > 0 ? '+' : ''}
                    {formatCurrencyIDR(evaluation.selisihAnggaran)})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: KPI Evaluation Table & Mini Visual */}
        <section className="mt-8">
          <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
            2. Hasil Evaluasi &amp; Visualisasi Pencapaian KPI
          </h3>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse border border-[#B8D9F5] text-left text-sm">
              <thead>
                <tr className="bg-[#DCEEFF]/60 text-xs leading-snug font-bold tracking-[0.02em] text-[#34495E]">
                  <th className="border border-[#B8D9F5] px-4 py-3">Indikator KPI</th>
                  <th className="border border-[#B8D9F5] px-4 py-3 text-right">
                    Target Sebelum
                  </th>
                  <th className="border border-[#B8D9F5] px-4 py-3 text-right">
                    Capaian Setelah
                  </th>
                  <th className="border border-[#B8D9F5] px-4 py-3 text-right">
                    Selisih
                  </th>
                  <th className="border border-[#B8D9F5] px-4 py-3 text-right">
                    Pencapaian
                  </th>
                  <th className="border border-[#B8D9F5] px-4 py-3">Indikator Hasil</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.perbandinganKpi.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="border border-[#B8D9F5] px-4 py-3 font-semibold text-[#34495E]">
                      {idx + 1}. {row.nama} ({row.satuan})
                    </td>
                    <td className="border border-[#B8D9F5] px-4 py-3 text-right text-xs text-[#566B80] tabular-nums">
                      {formatNumberId(row.target)}
                    </td>
                    <td className="border border-[#B8D9F5] px-4 py-3 text-right text-xs font-bold text-[#34495E] tabular-nums">
                      {formatNumberId(row.capaian)}
                    </td>
                    <td
                      className={`border border-[#B8D9F5] px-4 py-3 text-right text-xs font-semibold tabular-nums ${
                        row.selisih >= 0 ? 'text-[#1E7E5A]' : 'text-[#B84343]'
                      }`}
                    >
                      {row.selisih >= 0 ? '+' : ''}
                      {formatNumberId(row.selisih)}
                    </td>
                    <td className="border border-[#B8D9F5] px-4 py-3 text-right text-xs font-bold text-[#34495E] tabular-nums">
                      {row.persentase}%
                    </td>
                    <td className="border border-[#B8D9F5] px-4 py-3 text-xs font-bold text-[#34495E]">
                      {row.indikator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Printable Visual Summary Bars */}
          <div className="mt-4 rounded-lg border border-[#B8D9F5] bg-[#DCEEFF]/20 p-4">
            <div className="mb-3 text-xs font-bold text-[#34495E]">
              Grafik Ringkas Pencapaian KPI (Batas Efektivitas {EFFECTIVENESS_THRESHOLD}%)
            </div>
            <div className="space-y-2.5">
              {evaluation.perbandinganKpi.map((row) => (
                <div key={row.id} className="grid grid-cols-12 items-center gap-3 text-xs">
                  <div className="col-span-5 truncate font-semibold text-[#34495E]">
                    {row.nama}
                  </div>
                  <div className="col-span-5 relative h-2.5 overflow-hidden rounded-sm border border-[#B8D9F5] bg-[#FFFEF8]">
                    <div
                      className={`h-full ${
                        row.persentase >= 100
                          ? 'bg-[#8FC4EA]'
                          : row.persentase >= EFFECTIVENESS_THRESHOLD
                            ? 'bg-[#F5D77E]'
                            : 'bg-[#E8A29E]'
                      }`}
                      style={{ width: `${Math.min(100, (row.persentase / 125) * 100)}%` }}
                    />
                  </div>
                  <div className="col-span-2 text-right font-bold text-[#34495E] tabular-nums">
                    {row.persentase}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Improvement Plan (if Belum Efektif or notes exist) */}
        {(!isEffective ||
          selectedImprovements.length > 0 ||
          campaign.catatanPerbaikan.trim().length > 0) && (
          <section className="mt-8">
            <h3 className="text-base leading-[1.38] font-bold tracking-[0.008em] text-[#34495E]">
              3. Rekomendasi &amp; Rencana Perbaikan Kampanye
            </h3>

            {weakKpis.length > 0 && (
              <div className="mt-3 rounded-lg border border-[#E5B8B8] bg-[#FDECEC]/60 px-4 py-3 text-xs leading-relaxed tracking-[0.01em] text-[#34495E]">
                <span className="font-bold text-[#B84343]">
                  KPI di bawah standar (&lt; {EFFECTIVENESS_THRESHOLD}%):{' '}
                </span>
                {weakKpis.map((w) => `${w.nama} (${w.persentase}%)`).join(' · ')}
              </div>
            )}

            {selectedImprovements.length > 0 ? (
              <ul className="mt-3 space-y-2.5 text-sm text-[#34495E]">
                {selectedImprovements.map((opt) => (
                  <li
                    key={opt.id}
                    className="rounded-lg border border-[#F5D77E] bg-[#FFF1B8]/35 px-4 py-3"
                  >
                    <div className="leading-snug font-bold tracking-[0.008em] text-[#34495E]">{opt.judul}</div>
                    <div className="mt-1 text-xs leading-[1.65] tracking-[0.01em] text-[#566B80]">{opt.deskripsi}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-[1.68] tracking-[0.008em] text-[#566B80]">
                Belum ada opsi perbaikan yang dipilih pada tahap evaluasi.
              </p>
            )}

            {campaign.catatanPerbaikan.trim().length > 0 && (
              <div className="mt-3 rounded-lg border border-[#B8D9F5] bg-[#DCEEFF]/25 px-4 py-3 text-sm">
                <div className="text-xs font-bold tracking-[0.015em] text-[#566B80]">
                  Catatan Perbaikan Praktisi Humas
                </div>
                <p className="mt-1.5 leading-[1.7] tracking-[0.008em] text-[#34495E]">{campaign.catatanPerbaikan}</p>
              </div>
            )}
          </section>
        )}

        {/* Footer Signature Block */}
        <footer className="mt-10 flex flex-col justify-between gap-6 border-t border-[#F5D77E] pt-6 text-xs leading-relaxed tracking-[0.012em] text-[#566B80] sm:flex-row sm:items-end">
          <div>
            <div>Dokumen resmi dihasilkan oleh SEEK (Sistem Evaluasi Efektivitas Kampanye Kehumasan).</div>
            <div className="mt-1">BEM Program Studi Hubungan Masyarakat dan Komunikasi Digital, Universitas Negeri Jakarta</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-bold tracking-[0.008em] text-[#34495E]">
              {campaign.penanggungJawab || 'Divisi Hubungan Masyarakat'}
            </div>
            <div className="mt-1">Penanggung Jawab Evaluasi Kampanye</div>
          </div>
        </footer>
      </article>
    </div>
  );
};
