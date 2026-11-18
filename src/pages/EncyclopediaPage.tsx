import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { TreasureCard } from '../components/TreasureCard';
import { useHeritage } from '../context/HeritageContext';
import type { TreasureRecord } from '../types/heritage';

const ITEMS_PER_PAGE = 9;

export const EncyclopediaPage: React.FC = () => {
  const { data, t, buildPath } = useHeritage();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [periodFilter, setPeriodFilter] = useState(searchParams.get('period') || 'all');
  const [cultureFilter, setCultureFilter] = useState(searchParams.get('culture') || 'all');
  const [dynastyFilter, setDynastyFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState(searchParams.get('material') || 'all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [keeperFilter, setKeeperFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'batch'>('code');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [quickViewItem, setQuickViewItem] = useState<TreasureRecord | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    const c = searchParams.get('culture');
    const m = searchParams.get('material');
    const p = searchParams.get('period');
    if (q !== null) setQuery(q);
    if (c) setCultureFilter(c);
    if (m) setMaterialFilter(m);
    if (p) setPeriodFilter(p);
  }, [searchParams]);

  const treasures = data?.treasures || [];
  const keepers = data?.keepers || [];
  const periods = data?.periods || [];
  const cultures = data?.cultures || [];
  const materials = data?.materials || [];

  const keeperMap = useMemo(() => new Map(keepers.map((k) => [k.id, k])), [keepers]);

  const dynasties = useMemo(() => {
    return Array.from(new Set(treasures.map((tr) => tr.dynasty))).sort((a, b) =>
      a.localeCompare(b, 'vi'),
    );
  }, [treasures]);

  const provinces = useMemo(() => {
    return Array.from(new Set(keepers.map((k) => k.provinceOrCity))).sort((a, b) =>
      a.localeCompare(b, 'vi'),
    );
  }, [keepers]);

  const batches = useMemo(() => {
    const nums = treasures
      .map((tr) => tr.batchNumber)
      .filter((n): n is number => n !== null);
    return Array.from(new Set(nums)).sort((a, b) => a - b);
  }, [treasures]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return treasures
      .filter((tr) => {
        const keeper = keeperMap.get(tr.currentKeeperId);
        if (periodFilter !== 'all' && !tr.periodIds.includes(periodFilter)) return false;
        if (cultureFilter !== 'all' && tr.cultureId !== cultureFilter) return false;
        if (dynastyFilter !== 'all' && tr.dynasty !== dynastyFilter) return false;
        if (materialFilter !== 'all' && !tr.materialIds.includes(materialFilter)) return false;
        if (keeperFilter !== 'all' && tr.currentKeeperId !== keeperFilter) return false;
        if (provinceFilter !== 'all' && keeper?.provinceOrCity !== provinceFilter) return false;
        if (batchFilter !== 'all' && String(tr.batchNumber) !== batchFilter) return false;
        if (statusFilter !== 'all' && tr.recognitionStatus !== statusFilter) return false;

        if (q) {
          const hay = [
            tr.officialName,
            tr.otherNames.join(' '),
            tr.code,
            tr.dating,
            tr.dynasty,
            tr.discoveryPlace,
            tr.decisionNumber || '',
            tr.summary,
            keeper?.officialName || '',
            keeper?.provinceOrCity || '',
          ]
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.officialName.localeCompare(b.officialName, 'vi');
        if (sortBy === 'batch') return (a.batchNumber ?? 999) - (b.batchNumber ?? 999);
        return a.code.localeCompare(b.code);
      });
  }, [
    treasures,
    keeperMap,
    periodFilter,
    cultureFilter,
    dynastyFilter,
    materialFilter,
    keeperFilter,
    provinceFilter,
    batchFilter,
    statusFilter,
    query,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setQuery('');
    setPeriodFilter('all');
    setCultureFilter('all');
    setDynastyFilter('all');
    setMaterialFilter('all');
    setProvinceFilter('all');
    setKeeperFilter('all');
    setBatchFilter('all');
    setStatusFilter('all');
    setPage(1);
  };

  if (!data) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Thư viện hiện vật & Bách khoa toàn thư số
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">
          {t.nav.encyclopedia}
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          Tra cứu hồ sơ chuẩn hóa Dublin Core 15 trường. Phân biệt rõ <strong>Bảo vật Quốc gia</strong> (đã có quyết định công nhận của Thủ tướng Chính phủ) và <strong>Hiện vật Di sản tiêu biểu</strong> (chưa có quyết định công nhận Bảo vật Quốc gia).
        </p>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="border border-[#D8CEB8] bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-[#6B7280] absolute left-3 top-2.5" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên bảo vật, mã hồ sơ, từ khóa, số quyết định..."
              className="w-full border border-[#D8CEB8] pl-9 pr-3 py-2 text-xs text-[#1E242B] focus:outline-none focus:border-[#0F1E33]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full border border-[#D8CEB8] px-3 py-2 text-xs text-[#1E242B] bg-white"
            >
              <option value="all">Tất cả trạng thái công nhận</option>
              <option value="national_treasure">Bảo vật Quốc gia (Đã công nhận)</option>
              <option value="representative_heritage">Hiện vật Di sản tiêu biểu</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'code' | 'name' | 'batch')}
              className="w-full border border-[#D8CEB8] px-3 py-2 text-xs text-[#1E242B] bg-white"
            >
              <option value="code">Sắp xếp: Mã hồ sơ</option>
              <option value="name">Sắp xếp: Tên A–Z</option>
              <option value="batch">Sắp xếp: Đợt công nhận</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`p-2 border cursor-pointer ${
                layout === 'grid'
                  ? 'border-[#0F1E33] bg-[#0F1E33] text-white'
                  : 'border-[#D8CEB8] bg-white text-[#4B5563]'
              }`}
              title="Lưới ảnh"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              className={`p-2 border cursor-pointer ${
                layout === 'list'
                  ? 'border-[#0F1E33] bg-[#0F1E33] text-white'
                  : 'border-[#D8CEB8] bg-white text-[#4B5563]'
              }`}
              title="Danh sách"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 border border-[#D8CEB8] px-2.5 py-2 text-xs text-[#5B3E2A] hover:bg-[#F3EFE6] cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          <select
            value={periodFilter}
            onChange={(e) => {
              setPeriodFilter(e.target.value);
              setPage(1);
            }}
            className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
          >
            <option value="all">Theo thời kỳ (Tất cả)</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.order}. {p.name}
              </option>
            ))}
          </select>

          <select
            value={cultureFilter}
            onChange={(e) => {
              setCultureFilter(e.target.value);
              setPage(1);
            }}
            className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
          >
            <option value="all">Theo nền văn hóa</option>
            {cultures.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={dynastyFilter}
            onChange={(e) => {
              setDynastyFilter(e.target.value);
              setPage(1);
            }}
            className="border border-[#D8CEB8] px-2.5 py-2 text-xs bg-white"
          >
            <option value="all">Theo triều đại</option>
            {dynasties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={materialFilter}
            onChange={(e) => {
              setMaterialFilter(e.target.value);
              setPage(1);
            }}
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
            onChange={(e) => {
              setProvinceFilter(e.target.value);
              setPage(1);
            }}
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
            onChange={(e) => {
              setKeeperFilter(e.target.value);
              setPage(1);
            }}
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

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5B3E2A] pt-1 border-t border-[#EFE9DC]">
          <span>
            Tìm thấy <strong className="tabular-nums text-[#0F1E33]">{filtered.length}</strong> hồ sơ phù hợp
          </span>
          <div className="flex items-center gap-2">
            <span>Đợt công nhận:</span>
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                setPage(1);
              }}
              className="border border-[#D8CEB8] px-2 py-1 text-xs bg-white"
            >
              <option value="all">Tất cả các đợt</option>
              {batches.map((b) => (
                <option key={b} value={String(b)}>
                  Đợt {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {paginated.length === 0 ? (
        <div className="border border-[#D8CEB8] bg-white p-12 text-center space-y-3">
          <p className="font-serif text-xl text-[#0F1E33]">
            Không có hồ sơ nào khớp với điều kiện lọc
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-[#0F1E33] px-4 py-2 text-xs font-medium text-white cursor-pointer"
          >
            {t.labels.reset}
          </button>
        </div>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((tr) => (
            <TreasureCard key={tr.id} treasure={tr} onQuickView={setQuickViewItem} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((tr) => (
            <TreasureCard key={tr.id} treasure={tr} onQuickView={setQuickViewItem} layout="list" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border border-[#D8CEB8] bg-white px-3 py-1.5 text-xs font-medium text-[#0F1E33] disabled:opacity-40 cursor-pointer"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`px-3 py-1.5 text-xs font-mono border cursor-pointer ${
                n === page
                  ? 'border-[#0F1E33] bg-[#0F1E33] text-white'
                  : 'border-[#D8CEB8] bg-white text-[#0F1E33]'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border border-[#D8CEB8] bg-white px-3 py-1.5 text-xs font-medium text-[#0F1E33] disabled:opacity-40 cursor-pointer"
          >
            Sau
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#091321]/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-2xl w-full bg-[#FAF8F3] border border-[#9A6E2A] p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-[#D8CEB8] pb-3">
              <div>
                <p className="font-mono text-xs text-[#7A541C]">{quickViewItem.code}</p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#0F1E33]">
                  {quickViewItem.officialName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewItem(null)}
                className="border border-[#D8CEB8] bg-white px-3 py-1 text-xs cursor-pointer"
              >
                {t.labels.close}
              </button>
            </div>
            <p className="text-sm text-[#1E242B] leading-relaxed">{quickViewItem.summary}</p>
            <div className="flex justify-end gap-3 pt-2">
              <Link
                to={buildPath(`/treasures/${quickViewItem.id}`)}
                className="bg-[#0F1E33] px-4 py-2 text-xs font-semibold text-[#FAF8F3]"
              >
                {t.labels.viewDetail} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
