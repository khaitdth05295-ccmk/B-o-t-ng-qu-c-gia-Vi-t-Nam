import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { TreasureCard } from '../components/TreasureCard';
import { useHeritage } from '../context/HeritageContext';

export const PeriodsPage: React.FC = () => {
  const { data } = useHeritage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPeriodId, setSelectedPeriodId] = useState(
    searchParams.get('period') || 'period-dong-son',
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'national_treasure' | 'representative_heritage'>('all');

  useEffect(() => {
    const p = searchParams.get('period');
    if (p) setSelectedPeriodId(p);
  }, [searchParams]);

  if (!data) return null;

  const { periods, treasures, sources } = data;
  const activePeriod = periods.find((p) => p.id === selectedPeriodId) || periods[0];

  const periodArtifacts = treasures.filter((tr) => {
    if (!tr.periodIds.includes(activePeriod.id)) return false;
    if (statusFilter !== 'all' && tr.recognitionStatus !== statusFilter) return false;
    return true;
  });

  const periodSources = sources.filter((s) => activePeriod.sourceIds.includes(s.id));

  const selectPeriod = (id: string) => {
    setSelectedPeriodId(id);
    setSearchParams({ period: id });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Phân loại lịch sử · 16 giai đoạn
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">
          Khám phá theo 16 Thời kỳ lịch sử Việt Nam
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          Mỗi thời kỳ hướng tới tối đa 8 thẻ nội dung khám phá có căn cứ xác thực. Nền tảng tuyệt đối không tạo hồ sơ giả để lấp đầy khi chưa đủ bảo vật đã xác minh, đồng thời tách biệt rõ <strong>BẢO VẬT QUỐC GIA</strong> và <strong>HIỆN VẬT DI SẢN TIÊU BIỂU</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 16 Period Categories List */}
        <aside className="lg:col-span-4 border border-[#D8CEB8] bg-white divide-y divide-[#EFE9DC]">
          {periods.map((p) => {
            const totalInPeriod = treasures.filter((tr) => tr.periodIds.includes(p.id)).length;
            const active = p.id === activePeriod.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPeriod(p.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  active ? 'bg-[#0F1E33] text-[#FAF8F3]' : 'hover:bg-[#FAF8F3] text-[#1E242B]'
                }`}
              >
                <div>
                  <span
                    className={`font-mono text-[11px] mr-2 ${
                      active ? 'text-[#DFC484]' : 'text-[#9A6E2A]'
                    }`}
                  >
                    {String(p.order).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-base font-semibold">{p.name}</span>
                  <p className={`text-[11px] mt-0.5 ${active ? 'text-[#C7BCA6]' : 'text-[#6B7280]'}`}>
                    {p.dateRange}
                  </p>
                </div>
                <span
                  className={`font-mono text-xs tabular-nums shrink-0 ${
                    active ? 'text-[#DFC484]' : 'text-[#7A541C]'
                  }`}
                >
                  {totalInPeriod}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Active Period Content */}
        <main className="lg:col-span-8 space-y-6">
          <div className="border border-[#D8CEB8] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE9DC] pb-4">
              <div>
                <p className="font-mono text-xs text-[#7A541C]">
                  NHÓM {String(activePeriod.order).padStart(2, '0')} · {activePeriod.dateRange}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-[#0F1E33]">
                  {activePeriod.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as 'all' | 'national_treasure' | 'representative_heritage',
                    )
                  }
                  className="border border-[#D8CEB8] px-3 py-1.5 text-xs bg-[#FAF8F3]"
                >
                  <option value="all">Tất cả nhãn phân loại</option>
                  <option value="national_treasure">A. Bảo vật Quốc gia</option>
                  <option value="representative_heritage">B. Hiện vật Di sản tiêu biểu</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-[#1E242B] leading-relaxed">{activePeriod.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#FAF8F3] border border-[#E6DFD0] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A541C] mb-2">
                  Dấu mốc tiêu biểu
                </h3>
                <ul className="space-y-1.5 text-xs text-[#1E242B] list-disc pl-4">
                  {activePeriod.keyEvents.map((ev) => (
                    <li key={ev}>{ev}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#FAF8F3] border border-[#E6DFD0] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A541C] mb-2">
                  Nguồn tham khảo đối chiếu
                </h3>
                <ul className="space-y-1.5 text-xs text-[#0F1E33]">
                  {periodSources.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[#9A6E2A]"
                      >
                        [{s.code}] {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Transparent Notice when < 8 verified records */}
          {periodArtifacts.length < 8 && (
            <div className="border border-[#C8A252]/70 bg-[#F3EFE6] px-4 py-3 flex items-start gap-2.5 text-xs text-[#3A2618]">
              <AlertCircle className="h-4 w-4 text-[#9A6E2A] shrink-0 mt-0.5" />
              <p>
                Hiện có <strong className="tabular-nums">{periodArtifacts.length}/8</strong> thẻ nội dung đã xác minh trong cơ sở dữ liệu cho giai đoạn <strong>{activePeriod.name}</strong>. Nền tảng không tự tạo thêm dữ liệu giả lập khi chưa có hồ sơ kiểm chứng bổ sung.
              </p>
            </div>
          )}

          {periodArtifacts.length === 0 ? (
            <div className="border border-[#D8CEB8] bg-white p-10 text-center text-sm text-[#5B3E2A]">
              Chưa có hồ sơ hiện vật nào được nhập cho thời kỳ này với bộ lọc hiện tại. Quản trị viên có thể bổ sung hồ sơ đã xác minh trong khu vực Quản trị.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {periodArtifacts.slice(0, 8).map((tr) => (
                <TreasureCard key={tr.id} treasure={tr} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
