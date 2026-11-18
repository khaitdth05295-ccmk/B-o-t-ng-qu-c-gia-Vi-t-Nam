import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TreasureCard } from '../components/TreasureCard';
import { useHeritage } from '../context/HeritageContext';

export const TimelinePage: React.FC = () => {
  const { data, t, buildPath } = useHeritage();
  const [activeStageIndex, setActiveStageIndex] = useState(2); // Default: Đông Sơn

  if (!data) return null;

  const timelineStages = [
    {
      id: 'stage-tien-so-su',
      label: 'Tiền sử & Sơ sử',
      dateRange: '300.000 – 2.700 BP',
      periodIds: ['period-tien-su', 'period-so-su'],
    },
    { id: 'stage-dong-son', label: 'Đông Sơn', dateRange: 'TK VII TCN – TK I–II', periodIds: ['period-dong-son'] },
    { id: 'stage-sa-huynh', label: 'Sa Huỳnh', dateRange: '1000 TCN – TK II', periodIds: ['period-sa-huynh'] },
    { id: 'stage-oc-eo', label: 'Óc Eo', dateRange: 'TK I – TK VII', periodIds: ['period-oc-eo'] },
    { id: 'stage-cham-pa', label: 'Chăm Pa', dateRange: 'TK II – TK XVII', periodIds: ['period-cham-pa'] },
    { id: 'stage-bac-thuoc', label: 'Bắc thuộc', dateRange: '179 TCN – 938', periodIds: ['period-bac-thuoc'] },
    { id: 'stage-ly', label: 'Lý', dateRange: '1009 – 1225', periodIds: ['period-ly'] },
    { id: 'stage-tran', label: 'Trần', dateRange: '1226 – 1400', periodIds: ['period-tran'] },
    { id: 'stage-ho', label: 'Hồ', dateRange: '1400 – 1407', periodIds: ['period-ho'] },
    { id: 'stage-le', label: 'Lê', dateRange: '1428 – 1789', periodIds: ['period-le'] },
    { id: 'stage-mac', label: 'Mạc', dateRange: '1527 – 1592', periodIds: ['period-mac'] },
    { id: 'stage-tay-son', label: 'Tây Sơn', dateRange: '1778 – 1802', periodIds: ['period-tay-son'] },
    { id: 'stage-nguyen', label: 'Nguyễn', dateRange: '1802 – 1945', periodIds: ['period-nguyen'] },
    { id: 'stage-hien-dai', label: 'Hiện đại', dateRange: 'Thế kỷ XX – nay', periodIds: ['period-hien-dai'] },
  ];

  const activeStage = timelineStages[activeStageIndex];
  const matchedPeriods = data.periods.filter((p) => activeStage.periodIds.includes(p.id));
  const stageTreasures = data.treasures.filter((tr) =>
    tr.periodIds.some((pid) => activeStage.periodIds.includes(pid)),
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Tiến trình di sản Việt Nam
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">{t.nav.timeline}</h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl">
          Dòng thời gian tương tác qua 14 giai đoạn lịch sử. Chỉ gắn hiện vật vào thời kỳ khi có căn cứ khảo cổ học, văn khắc hoặc sử liệu xác minh.
        </p>
      </div>

      {/* Horizontal Interactive Timeline Rail */}
      <div className="border border-[#D8CEB8] bg-white p-4 overflow-x-auto">
        <div className="flex items-stretch gap-2 min-w-max">
          {timelineStages.map((stage, idx) => {
            const active = idx === activeStageIndex;
            const count = data.treasures.filter((tr) =>
              tr.periodIds.some((pid) => stage.periodIds.includes(pid)),
            ).length;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`px-4 py-3 text-left border transition-colors min-w-[145px] cursor-pointer ${
                  active
                    ? 'border-[#0F1E33] bg-[#0F1E33] text-[#FAF8F3]'
                    : 'border-[#E6DFD0] bg-[#FAF8F3] text-[#1E242B] hover:border-[#9A6E2A]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={active ? 'text-[#DFC484]' : 'text-[#7A541C]'}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="tabular-nums">{count} hồ sơ</span>
                </div>
                <p className="mt-1 font-serif text-base font-semibold whitespace-nowrap">
                  {stage.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${active ? 'text-[#C7BCA6]' : 'text-[#6B7280]'}`}>
                  {stage.dateRange}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 border border-[#D8CEB8] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7A541C]">
            <Calendar className="h-4 w-4 text-[#9A6E2A]" />
            <span>{activeStage.dateRange}</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#0F1E33]">
            Giai đoạn {activeStage.label}
          </h2>
          {matchedPeriods.map((mp) => (
            <div key={mp.id} className="space-y-3 border-t border-[#EFE9DC] pt-3">
              <h3 className="font-serif text-lg font-semibold text-[#3A2618]">{mp.name}</h3>
              <p className="text-sm text-[#1E242B] leading-relaxed">{mp.summary}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A541C] mb-1.5">
                  Sự kiện & Bối cảnh liên quan
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs text-[#4B5563]">
                  {mp.keyEvents.map((ev) => (
                    <li key={ev}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <Link
              to={buildPath(`/periods?period=${activeStage.periodIds[0]}`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>Xem phân loại chi tiết trong 16 Thời kỳ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8CEB8] pb-3">
            <h3 className="font-serif text-2xl font-semibold text-[#0F1E33]">
              Hiện vật & Bảo vật thuộc giai đoạn ({stageTreasures.length})
            </h3>
          </div>
          {stageTreasures.length === 0 ? (
            <div className="border border-[#D8CEB8] bg-white p-8 text-center text-sm text-[#5B3E2A]">
              Chưa có hồ sơ hiện vật được xác minh gắn với giai đoạn này trong cơ sở dữ liệu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stageTreasures.map((tr) => (
                <TreasureCard key={tr.id} treasure={tr} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
