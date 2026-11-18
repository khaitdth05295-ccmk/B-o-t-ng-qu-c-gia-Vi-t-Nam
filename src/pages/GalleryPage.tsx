import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileWarning, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArtifactVisualFrame } from '../components/ArtifactVisualFrame';
import { useHeritage } from '../context/HeritageContext';

export const GalleryPage: React.FC = () => {
  const { data, t, buildPath } = useHeritage();
  const [treasureFilter, setTreasureFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [keeperFilter, setKeeperFilter] = useState('all');

  const treasures = data?.treasures || [];
  const keepers = data?.keepers || [];
  const images = data?.images || [];
  const periods = data?.periods || [];
  const materials = data?.materials || [];
  const imageAudit = data?.imageAudit;

  const keeperMap = useMemo(() => new Map(keepers.map((k) => [k.id, k])), [keepers]);
  const treasureMap = useMemo(() => new Map(treasures.map((tr) => [tr.id, tr])), [treasures]);

  const provinces = useMemo(
    () => Array.from(new Set(keepers.map((k) => k.provinceOrCity))).sort((a, b) => a.localeCompare(b, 'vi')),
    [keepers],
  );

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const tr = treasureMap.get(img.treasureId);
      if (!tr) return false;
      const keeper = keeperMap.get(tr.currentKeeperId);
      if (treasureFilter !== 'all' && tr.id !== treasureFilter) return false;
      if (periodFilter !== 'all' && !tr.periodIds.includes(periodFilter)) return false;
      if (materialFilter !== 'all' && !tr.materialIds.includes(materialFilter)) return false;
      if (keeperFilter !== 'all' && tr.currentKeeperId !== keeperFilter) return false;
      if (provinceFilter !== 'all' && keeper?.provinceOrCity !== provinceFilter) return false;
      return true;
    });
  }, [images, treasureMap, keeperMap, treasureFilter, periodFilter, materialFilter, keeperFilter, provinceFilter]);

  if (!data) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Kiểm kê hình ảnh & Tư liệu thị giác
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">{t.nav.gallery}</h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          Quản lý đối chiếu ảnh hiện vật thật theo mã định danh. Nền tảng không sử dụng ảnh tạo bởi AI để giả làm ảnh hiện vật lịch sử và không tự động gắn ảnh chưa xác minh nguồn.
        </p>
      </div>

      {/* Asset Audit Summary Report */}
      {imageAudit && (
        <div className="border border-[#C8A252] bg-[#F3EFE6] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              {imageAudit.scannedTotal === 0 ? (
                <AlertTriangle className="h-5 w-5 text-[#9A3412] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-[#14532D] shrink-0 mt-0.5" />
              )}
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#0F1E33]">
                  Báo cáo kiểm kê thư mục ảnh dự án (JPG, JPEG, PNG, WEBP)
                </h2>
                <p className="text-xs text-[#3A2618] mt-1 leading-relaxed">
                  {imageAudit.scannedTotal === 0
                    ? 'Không tìm thấy tệp ảnh hiện vật nào từ ứng dụng cũ được chuyển sang thư mục /public/images/treasures hoặc /public/uploads/treasures của dự án mới. Vui lòng tải lại bộ ảnh gốc qua Khu vực Quản trị để gắn đúng theo mã định danh hồ sơ.'
                    : `Đã quét ${imageAudit.scannedTotal} tệp ảnh trong hệ thống: ${imageAudit.verifiedMappedCount} ảnh khớp hồ sơ, ${imageAudit.unusedFiles.length} ảnh chưa gắn hồ sơ, ${imageAudit.duplicates.length} nhóm trùng lặp mã băm.`}
                </p>
              </div>
            </div>

            <Link
              to={buildPath('/admin?tab=images')}
              className="inline-flex items-center gap-2 bg-[#0F1E33] px-4 py-2 text-xs font-semibold text-[#FAF8F3] hover:bg-[#182D49]"
            >
              <Upload className="h-3.5 w-3.5 text-[#DFC484]" />
              <span>Tải ảnh hiện vật lên Quản trị</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white border border-[#D8CEB8] p-3">
              <p className="text-[#6B7280]">Ảnh đã quét trên đĩa</p>
              <p className="font-mono text-xl font-bold text-[#0F1E33] tabular-nums mt-1">
                {imageAudit.scannedTotal}
              </p>
            </div>
            <div className="bg-white border border-[#D8CEB8] p-3">
              <p className="text-[#6B7280]">Ảnh đã gắn đúng hồ sơ</p>
              <p className="font-mono text-xl font-bold text-[#14532D] tabular-nums mt-1">
                {imageAudit.verifiedMappedCount}
              </p>
            </div>
            <div className="bg-white border border-[#D8CEB8] p-3">
              <p className="text-[#6B7280]">Hồ sơ đang thiếu ảnh</p>
              <p className="font-mono text-xl font-bold text-[#9A3412] tabular-nums mt-1">
                {imageAudit.missingImages.length}
              </p>
            </div>
            <div className="bg-white border border-[#D8CEB8] p-3">
              <p className="text-[#6B7280]">Ảnh trùng / Chưa dùng</p>
              <p className="font-mono text-xl font-bold text-[#7A541C] tabular-nums mt-1">
                {imageAudit.duplicates.length} / {imageAudit.unusedFiles.length}
              </p>
            </div>
          </div>

          {imageAudit.missingImages.length > 0 && (
            <details className="bg-white border border-[#D8CEB8] p-3 text-xs">
              <summary className="cursor-pointer font-semibold text-[#0F1E33] flex items-center gap-1.5">
                <FileWarning className="h-3.5 w-3.5 text-[#9A3412]" />
                <span>
                  Danh sách chính xác {imageAudit.missingImages.length} tệp ảnh cần bổ sung theo mã bảo vật
                </span>
              </summary>
              <div className="mt-3 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {imageAudit.missingImages.map((mi) => {
                  const tr = treasureMap.get(mi.treasureId);
                  return (
                    <div key={mi.id} className="border border-[#EFE9DC] px-2.5 py-1.5 bg-[#FAF8F3]">
                      <span className="font-mono font-semibold text-[#7A541C]">
                        {mi.expectedFilename}
                      </span>
                      <span className="block text-[11px] text-[#4B5563] truncate">
                        → {tr?.officialName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Gallery Filters */}
      <div className="border border-[#D8CEB8] bg-white p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          value={treasureFilter}
          onChange={(e) => setTreasureFilter(e.target.value)}
          className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
        >
          <option value="all">Theo bảo vật (Tất cả)</option>
          {treasures.map((tr) => (
            <option key={tr.id} value={tr.id}>
              {tr.code} · {tr.officialName}
            </option>
          ))}
        </select>

        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
        >
          <option value="all">Theo thời kỳ</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.order}. {p.name}
            </option>
          ))}
        </select>

        <select
          value={materialFilter}
          onChange={(e) => setMaterialFilter(e.target.value)}
          className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
        >
          <option value="all">Theo chất liệu</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
        >
          <option value="all">Theo địa phương</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={keeperFilter}
          onChange={(e) => setKeeperFilter(e.target.value)}
          className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
        >
          <option value="all">Theo bảo tàng / di tích</option>
          {keepers.map((k) => (
            <option key={k.id} value={k.id}>
              {k.officialName}
            </option>
          ))}
        </select>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => {
          const tr = treasureMap.get(img.treasureId);
          if (!tr) return null;
          return (
            <div key={img.id} className="border border-[#D8CEB8] bg-white p-4 space-y-3">
              <ArtifactVisualFrame treasure={tr} image={img} allowZoom />
              <div className="pt-2 border-t border-[#EFE9DC] flex items-center justify-between text-xs">
                <span className="text-[#5B3E2A]">Góc chụp: {img.angle}</span>
                <Link
                  to={buildPath(`/treasures/${tr.id}`)}
                  className="font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
                >
                  Xem hồ sơ →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
