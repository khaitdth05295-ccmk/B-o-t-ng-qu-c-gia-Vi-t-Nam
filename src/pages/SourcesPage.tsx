import React, { useMemo, useState } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';
import type { SourceRecord } from '../types/heritage';

const GROUP_LABELS: Record<SourceRecord['group'], string> = {
  state_agency: 'A. Cơ quan nhà nước',
  museum: 'B. Bảo tàng & Cơ quan lưu giữ',
  research_institute: 'C. Cơ quan nghiên cứu',
  international: 'D. Nguồn quốc tế',
  books_journals: 'E. Sách và công trình nghiên cứu',
};

export const SourcesPage: React.FC = () => {
  const { data, t, buildPath } = useHeritage();
  const [groupFilter, setGroupFilter] = useState<'all' | SourceRecord['group']>('all');

  const sources = data?.sources || [];
  const treasures = data?.treasures || [];
  const treasureMap = useMemo(() => new Map(treasures.map((tr) => [tr.id, tr])), [treasures]);

  const filtered = sources.filter((s) => groupFilter === 'all' || s.group === groupFilter);

  if (!data) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Thư viện tài liệu đối chiếu · {sources.length} nguồn riêng biệt
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">{t.nav.sources}</h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          Mỗi hồ sơ hiện vật trên nền tảng đều liên kết trực tiếp với tài liệu chính thống từ Cục Di sản văn hóa, Bộ VHTTDL, Cổng Chính phủ, bảo tàng lưu giữ, viện nghiên cứu và tổ chức quốc tế UNESCO/ICOM/DCMI.
        </p>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroupFilter('all')}
          className={`px-3.5 py-2 text-xs font-medium border cursor-pointer ${
            groupFilter === 'all'
              ? 'border-[#0F1E33] bg-[#0F1E33] text-[#FAF8F3]'
              : 'border-[#D8CEB8] bg-white text-[#1E242B]'
          }`}
        >
          Tất cả ({sources.length})
        </button>
        {(Object.keys(GROUP_LABELS) as Array<SourceRecord['group']>).map((g) => {
          const count = sources.filter((s) => s.group === g).length;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setGroupFilter(g)}
              className={`px-3.5 py-2 text-xs font-medium border cursor-pointer ${
                groupFilter === g
                  ? 'border-[#0F1E33] bg-[#0F1E33] text-[#FAF8F3]'
                  : 'border-[#D8CEB8] bg-white text-[#1E242B]'
              }`}
            >
              {GROUP_LABELS[g]} ({count})
            </button>
          );
        })}
      </div>

      {/* Sources Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((src) => (
          <article key={src.id} className="border border-[#D8CEB8] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-mono font-bold text-[#7A541C]">{src.code}</span>
              <span className="text-[#5B3E2A]">{GROUP_LABELS[src.group]}</span>
              <span className="inline-flex items-center gap-1 text-[#14532D] font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                {src.verificationStatus === 'verified' ? 'Đã xác minh' : 'Chờ đối chiếu'}
              </span>
            </div>

            <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">{src.name}</h2>
            <p className="text-xs font-medium text-[#3A2618]">{src.documentTitle}</p>
            <p className="text-xs text-[#4B5563] leading-relaxed">{src.description}</p>

            <div className="text-[11px] text-[#6B7280] space-y-1 pt-2 border-t border-[#EFE9DC]">
              <p>
                <strong>Cơ quan / Tác giả:</strong> {src.organizationOrAuthor}
              </p>
              <p>
                <strong>Xuất bản:</strong> {src.publishedDate} · <strong>Ngày truy cập:</strong>{' '}
                {src.accessedDate}
              </p>
              <p>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#0F1E33] underline hover:text-[#9A6E2A] font-medium"
                >
                  <span>{src.url}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            {src.relatedTreasureIds.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {src.relatedTreasureIds.map((tid) => {
                  const tr = treasureMap.get(tid);
                  if (!tr) return null;
                  return (
                    <Link
                      key={tid}
                      to={buildPath(`/treasures/${tr.id}`)}
                      className="border border-[#E6DFD0] bg-[#FAF8F3] px-2 py-0.5 text-[11px] text-[#0F1E33] hover:border-[#9A6E2A]"
                    >
                      {tr.officialName}
                    </Link>
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
