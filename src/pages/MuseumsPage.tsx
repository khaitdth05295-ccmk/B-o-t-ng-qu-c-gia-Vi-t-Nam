import React, { useMemo, useState } from 'react';
import { ArrowLeft, Clock, ExternalLink, Landmark, MapPin, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { TreasureCard } from '../components/TreasureCard';
import { useHeritage } from '../context/HeritageContext';

export const MuseumsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, t, buildPath } = useHeritage();
  const [query, setQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState<'all' | 'museum' | 'heritage_site'>('all');

  const keepers = data?.keepers || [];
  const treasures = data?.treasures || [];

  const provinces = useMemo(
    () => Array.from(new Set(keepers.map((k) => k.provinceOrCity))).sort((a, b) => a.localeCompare(b, 'vi')),
    [keepers],
  );

  const filteredKeepers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return keepers.filter((k) => {
      if (provinceFilter !== 'all' && k.provinceOrCity !== provinceFilter) return false;
      if (kindFilter !== 'all' && k.kind !== kindFilter) return false;
      if (q) {
        const hay = `${k.officialName} ${k.provinceOrCity} ${k.publicAddress}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [keepers, provinceFilter, kindFilter, query]);

  if (!data) return null;

  // Individual Museum / Heritage Site Profile Page
  if (id) {
    const keeper = keepers.find((k) => k.id === id);
    if (!keeper) {
      return (
        <div className="mx-auto max-w-[1000px] px-4 py-16 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold text-[#0F1E33]">Không tìm thấy đơn vị lưu giữ</h1>
          <Link to={buildPath('/museums')} className="inline-block bg-[#0F1E33] px-4 py-2 text-xs text-white">
            Quay lại danh sách Bảo tàng & Di tích
          </Link>
        </div>
      );
    }

    const heldTreasures = treasures.filter((tr) => tr.currentKeeperId === keeper.id);

    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
        <div className="flex items-center justify-between text-xs text-[#5B3E2A]">
          <Link to={buildPath('/museums')} className="inline-flex items-center gap-1.5 hover:text-[#0F1E33]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại Bảo tàng & Di tích</span>
          </Link>
          <span className="font-mono">{keeper.provinceOrCity}</span>
        </div>

        <div className="border border-[#D8CEB8] bg-white p-6 lg:p-8 space-y-6">
          <div className="border-b border-[#EFE9DC] pb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
              {keeper.kind === 'museum' ? 'Bảo tàng lưu giữ hiện vật' : 'Di tích & Trung tâm bảo tồn'}
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#0F1E33]">
              {keeper.officialName}
            </h1>
            <p className="mt-3 text-sm text-[#1E242B] leading-relaxed max-w-3xl">
              {keeper.introduction}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <p className="font-semibold text-[#5B3E2A]">Lịch sử hình thành</p>
              <p className="text-[#1E242B] leading-relaxed">{keeper.history}</p>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-[#5B3E2A]">Địa chỉ công khai</p>
                <p className="text-[#1E242B] mt-0.5">{keeper.publicAddress}</p>
              </div>
              <div>
                <p className="font-semibold text-[#5B3E2A]">Tọa độ đã xác minh</p>
                <p className="font-mono text-[#0F1E33] tabular-nums mt-0.5">
                  {keeper.coordinates.lat.toFixed(4)}° N, {keeper.coordinates.lng.toFixed(4)}° E
                </p>
                <p className="text-[11px] text-[#6B7280]">{keeper.coordinates.coordinateSource}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-[#5B3E2A] inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#9A6E2A]" />
                  <span>Giờ mở cửa & Tham quan</span>
                </p>
                <p className="text-[#1E242B] mt-0.5">{keeper.openingHours}</p>
                <p className="text-[#4B5563] mt-0.5">{keeper.visitingInfo}</p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={keeper.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#D8CEB8] bg-[#FAF8F3] px-3 py-1.5 font-medium text-[#0F1E33] hover:border-[#9A6E2A]"
                >
                  <span>Website chính thức</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <Link
                  to={buildPath(`/map?keeper=${keeper.id}`)}
                  className="inline-flex items-center gap-1.5 bg-[#0F1E33] px-3 py-1.5 font-medium text-[#FAF8F3]"
                >
                  <MapPin className="h-3 w-3 text-[#DFC484]" />
                  <span>Định vị trên Bản đồ D05</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-[#0F1E33] border-b border-[#D8CEB8] pb-3">
            Danh sách hiện vật & bảo vật đang lưu giữ / trưng bày ({heldTreasures.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heldTreasures.map((tr) => (
              <TreasureCard key={tr.id} treasure={tr} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Directory View
  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Hệ thống thiết chế di sản
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">{t.nav.museums}</h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl">
          Danh bạ các bảo tàng công lập và di tích quốc gia đặc biệt đang trực tiếp lưu giữ, bảo quản và trưng bày các Bảo vật Quốc gia Việt Nam.
        </p>
      </div>

      {/* Filters */}
      <div className="border border-[#D8CEB8] bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="h-4 w-4 text-[#6B7280] absolute left-3 top-2.5" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên bảo tàng, di tích, địa chỉ..."
            className="w-full border border-[#D8CEB8] pl-9 pr-3 py-2 text-xs"
          />
        </div>
        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="border border-[#D8CEB8] px-3 py-2 text-xs bg-white"
        >
          <option value="all">Tất cả Tỉnh / Thành phố</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as 'all' | 'museum' | 'heritage_site')}
          className="border border-[#D8CEB8] px-3 py-2 text-xs bg-white"
        >
          <option value="all">Tất cả loại hình đơn vị</option>
          <option value="museum">Bảo tàng công lập</option>
          <option value="heritage_site">Di tích & Khu bảo tồn</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKeepers.map((k) => {
          const count = treasures.filter((tr) => tr.currentKeeperId === k.id).length;
          return (
            <article key={k.id} className="border border-[#D8CEB8] bg-white p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium text-[#7A541C]">
                  <span>{k.kind === 'museum' ? 'Bảo tàng' : 'Di tích'}</span>
                  <span>{k.provinceOrCity}</span>
                </div>
                <h2 className="mt-2 font-serif text-xl font-semibold text-[#0F1E33]">
                  <Link to={buildPath(`/museums/${k.id}`)} className="hover:text-[#9A6E2A]">
                    {k.officialName}
                  </Link>
                </h2>
                <p className="mt-2 text-xs text-[#4B5563] leading-relaxed">{k.introduction}</p>
                <p className="mt-3 text-[11px] text-[#5B3E2A]">
                  <strong>Địa chỉ:</strong> {k.publicAddress}
                </p>
                <p className="mt-1 text-[11px] text-[#6B7280]">
                  <strong>Giờ mở cửa:</strong> {k.openingHours}
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFE9DC] flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#5B3E2A] font-medium tabular-nums">
                  <Landmark className="h-3.5 w-3.5 text-[#9A6E2A]" />
                  <span>{count} hồ sơ</span>
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    to={buildPath(`/map?keeper=${k.id}`)}
                    className="text-[#7A541C] hover:underline"
                  >
                    Bản đồ
                  </Link>
                  <Link
                    to={buildPath(`/museums/${k.id}`)}
                    className="font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
                  >
                    Trang đơn vị →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
