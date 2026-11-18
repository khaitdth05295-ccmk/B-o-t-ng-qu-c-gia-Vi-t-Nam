import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';
import type { TreasureRecord } from '../types/heritage';
import { ArtifactVisualFrame } from './ArtifactVisualFrame';

interface TreasureCardProps {
  treasure: TreasureRecord;
  onQuickView?: (treasure: TreasureRecord) => void;
  layout?: 'grid' | 'list';
}

export const TreasureCard: React.FC<TreasureCardProps> = ({
  treasure,
  onQuickView,
  layout = 'grid',
}) => {
  const { data, t, buildPath } = useHeritage();
  const image = data?.images.find((i) => i.treasureId === treasure.id);
  const keeper = data?.keepers.find((k) => k.id === treasure.currentKeeperId);
  const isNationalTreasure = treasure.recognitionStatus === 'national_treasure';

  if (layout === 'list') {
    return (
      <article className="border border-[#D8CEB8] bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-5">
        <div className="sm:w-56 shrink-0">
          <ArtifactVisualFrame
            treasure={treasure}
            image={image}
            aspectClass="aspect-[4/3]"
            showCaption={false}
            allowZoom={false}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-[#7A541C]">
              <span className={isNationalTreasure ? 'text-[#9A3412] font-semibold' : 'text-[#4B5563]'}>
                {isNationalTreasure ? t.labels.nationalTreasure : t.labels.representativeHeritage}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{treasure.code}</span>
              {treasure.batchNumber && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Đợt {treasure.batchNumber} ({treasure.decisionNumber})
                  </span>
                </>
              )}
            </div>
            <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#0F1E33]">
              <Link to={buildPath(`/treasures/${treasure.id}`)} className="hover:text-[#9A6E2A] transition-colors">
                {treasure.officialName}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-[#5B3E2A]">
              {treasure.dating} · {keeper?.officialName || treasure.archival.currentHoldingInstitution}
            </p>
            <p className="mt-2 text-sm text-[#4B5563] line-clamp-2 leading-relaxed">
              {treasure.summary}
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-[#F0EAE0]">
            <Link
              to={buildPath(`/treasures/${treasure.id}`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>{t.labels.viewDetail}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(treasure)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B3E2A] hover:text-[#0F1E33] cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{t.labels.quickView}</span>
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border border-[#D8CEB8] bg-white flex flex-col justify-between">
      <div>
        <Link to={buildPath(`/treasures/${treasure.id}`)} className="block">
          <ArtifactVisualFrame
            treasure={treasure}
            image={image}
            aspectClass="aspect-[4/3]"
            showCaption={false}
            allowZoom={false}
          />
        </Link>
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium">
            <span className={isNationalTreasure ? 'text-[#9A3412] font-semibold' : 'text-[#4B5563] font-semibold'}>
              {isNationalTreasure ? t.labels.nationalTreasure : t.labels.representativeHeritage}
            </span>
            <span className="text-[#9CA3AF]" aria-hidden="true">
              ·
            </span>
            <span className="font-mono text-[#7A541C] tabular-nums">{treasure.code}</span>
          </div>

          <h3 className="mt-2 font-serif text-lg font-semibold text-[#0F1E33] leading-snug text-balance">
            <Link to={buildPath(`/treasures/${treasure.id}`)} className="hover:text-[#9A6E2A] transition-colors">
              {treasure.officialName}
            </Link>
          </h3>

          <p className="mt-1.5 text-xs text-[#5B3E2A] line-clamp-1">{treasure.dating}</p>
          <p className="mt-0.5 text-xs text-[#6B7280] line-clamp-1">
            {keeper?.shortName || treasure.archival.currentHoldingInstitution}
            {treasure.decisionNumber ? ` · ${treasure.decisionNumber}` : ''}
          </p>

          <p className="mt-3 text-xs text-[#4B5563] line-clamp-3 leading-relaxed">
            {treasure.summary}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 border-t border-[#EFE9DC] bg-[#FAF8F3]/60 flex items-center justify-between gap-2">
        <Link
          to={buildPath(`/treasures/${treasure.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
        >
          <span>{t.labels.viewDetail}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(treasure)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#5B3E2A] hover:text-[#0F1E33] cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t.labels.quickView}</span>
          </button>
        )}
      </div>
    </article>
  );
};
