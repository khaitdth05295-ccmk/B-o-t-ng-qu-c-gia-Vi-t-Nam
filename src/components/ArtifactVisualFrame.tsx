import React, { useState } from 'react';
import { Eye, ImageOff, Maximize2, ShieldCheck, X } from 'lucide-react';
import type { TreasureImageRecord, TreasureRecord } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';

interface ArtifactVisualFrameProps {
  treasure: TreasureRecord;
  image?: TreasureImageRecord;
  aspectClass?: string;
  showCaption?: boolean;
  allowZoom?: boolean;
}

export const ArtifactVisualFrame: React.FC<ArtifactVisualFrameProps> = ({
  treasure,
  image,
  aspectClass = 'aspect-[4/3]',
  showCaption = true,
  allowZoom = true,
}) => {
  const { t } = useHeritage();
  const [imgError, setImgError] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const hasVerifiedFile = Boolean(image?.fileStatus === 'verified' && image?.filePath && !imgError);

  return (
    <div className="flex flex-col">
      <div
        className={`relative overflow-hidden border border-[#DDD4C2] bg-[#F3EFE6] ${aspectClass}`}
      >
        {hasVerifiedFile ? (
          <>
            <img
              src={image!.filePath!}
              alt={image!.caption || treasure.officialName}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-contain bg-[#161B22]"
            />
            {allowZoom && (
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#0F1E33]/90 px-3 py-1.5 text-xs font-medium text-[#FAF8F3] border border-[#C8A252]/50 hover:bg-[#0F1E33] transition-colors whitespace-nowrap"
                title="Phóng to ảnh hiện vật"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#DFC484]" />
                <span>Xem lớn</span>
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col justify-between p-5 bg-[radial-gradient(circle_at_top_right,#EBE4D5_0%,#F3EFE6_55%,#FAF8F3_100%)]">
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[11px] tracking-wider text-[#7A541C] tabular-nums">
                {treasure.code}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5B3E2A]">
                <ImageOff className="w-3.5 h-3.5 text-[#9A6E2A]" />
                <span>Chưa có ảnh gốc</span>
              </span>
            </div>

            <div className="my-auto py-3 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-[#C8A252]/60 bg-[#FAF8F3] text-[#0F1E33]">
                <Eye className="w-5 h-5 text-[#9A6E2A]" />
              </div>
              <p className="font-serif text-base font-semibold text-[#0F1E33] line-clamp-2 text-balance">
                {treasure.officialName}
              </p>
              <p className="mt-1 text-xs text-[#4B5563] line-clamp-1">{treasure.dating}</p>
            </div>

            <div className="border-t border-[#DDD4C2] pt-2.5 flex items-center justify-between gap-2 text-[11px] text-[#5B3E2A]">
              <span className="truncate font-mono">
                Tệp dự kiến: {image?.expectedFilename || `${treasure.code.toLowerCase()}.jpg`}
              </span>
            </div>
          </div>
        )}
      </div>

      {showCaption && (
        <div className="mt-2 space-y-1 text-xs text-[#4B5563]">
          <p className="font-serif italic text-[#3A2618]">
            {hasVerifiedFile ? image?.caption || treasure.officialName : t.labels.missingImageNotice}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#6B7280]">
            <span>Nguồn: {image?.source || treasure.dublinCore.source}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#9A6E2A]" />
              Quyền ảnh:{' '}
              {image?.permissionStatus === 'permission_granted'
                ? 'Đã cho phép công bố'
                : image?.permissionStatus === 'official_public_no_separate_permission'
                  ? 'Tư liệu công bố chính thức'
                  : image?.permissionStatus === 'not_permitted'
                    ? 'Không được phép công bố'
                    : 'Chưa xác nhận bản quyền ảnh'}
            </span>
          </div>
        </div>
      )}

      {zoomed && hasVerifiedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#091321]/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[92vh] max-w-5xl w-full bg-[#FAF8F3] border border-[#C8A252]/40 p-4 md:p-6 flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-[#E6DFD0] pb-3 mb-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#0F1E33]">
                  {treasure.officialName}
                </h3>
                <p className="text-xs text-[#4B5563]">
                  {treasure.code} · {image?.source}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomed(false)}
                className="inline-flex items-center gap-1.5 border border-[#DDD4C2] px-3 py-1.5 text-xs font-medium text-[#0F1E33] hover:bg-[#F3EFE6]"
              >
                <X className="w-4 h-4" />
                <span>{t.labels.close}</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[#111827] p-2">
              <img
                src={image!.filePath!}
                alt={image!.caption || treasure.officialName}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <p className="mt-3 font-serif italic text-sm text-[#3A2618]">
              {image?.caption || treasure.officialName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
