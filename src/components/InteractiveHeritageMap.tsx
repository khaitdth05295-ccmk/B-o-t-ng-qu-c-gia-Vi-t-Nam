import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  AlertTriangle,
  Compass,
  Layers,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';
import type { KeeperInstitution, MapProviderId, TreasureRecord } from '../types/heritage';

interface InteractiveHeritageMapProps {
  compact?: boolean;
  initialKeeperId?: string;
}

const VIETNAM_BOUNDS: L.LatLngBoundsExpression = [
  [8.18, 102.14],
  [23.39, 109.46],
];

const VIETNAM_CENTER: [number, number] = [16.1, 106.5];

export const InteractiveHeritageMap: React.FC<InteractiveHeritageMapProps> = ({
  compact = false,
  initialKeeperId,
}) => {
  const { data, t, buildPath } = useHeritage();
  const navigate = useNavigate();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const retryCountRef = useRef(0);

  const cartoKey = (import.meta.env.VITE_CARTO_BASEMAP_KEY as string | undefined)?.trim() || '';
  const maptilerKey = (import.meta.env.VITE_MAPTILER_KEY as string | undefined)?.trim() || '';

  const [provider, setProvider] = useState<MapProviderId>('osm');
  const [tileState, setTileState] = useState<'loading' | 'loaded' | 'error' | 'offline'>('loading');
  const [tileErrorMsg, setTileErrorMsg] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState<'all' | 'museum' | 'heritage_site'>('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [selectedKeeperId, setSelectedKeeperId] = useState<string | null>(initialKeeperId || null);

  const keepers = data?.keepers || [];
  const treasures = data?.treasures || [];
  const images = data?.images || [];
  const periods = data?.periods || [];
  const materials = data?.materials || [];

  const provinces = useMemo(() => {
    const set = new Set(keepers.map((k) => k.provinceOrCity));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [keepers]);

  const treasuresByKeeper = useMemo(() => {
    const map = new Map<string, TreasureRecord[]>();
    for (const tr of treasures) {
      const matchesPeriod = periodFilter === 'all' || tr.periodIds.includes(periodFilter);
      const matchesMaterial = materialFilter === 'all' || tr.materialIds.includes(materialFilter);
      if (!matchesPeriod || !matchesMaterial) continue;
      const list = map.get(tr.currentKeeperId) || [];
      list.push(tr);
      map.set(tr.currentKeeperId, list);
    }
    return map;
  }, [treasures, periodFilter, materialFilter]);

  const filteredKeepers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return keepers.filter((k) => {
      if (!k.coordinates.verified) return false;
      if (provinceFilter !== 'all' && k.provinceOrCity !== provinceFilter) return false;
      if (kindFilter !== 'all' && k.kind !== kindFilter) return false;

      const matchedTreasures = treasuresByKeeper.get(k.id) || [];
      if ((periodFilter !== 'all' || materialFilter !== 'all') && matchedTreasures.length === 0) {
        return false;
      }

      if (q) {
        const hay = `${k.officialName} ${k.provinceOrCity} ${k.publicAddress} ${matchedTreasures
          .map((x) => x.officialName)
          .join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [keepers, provinceFilter, kindFilter, periodFilter, materialFilter, searchQuery, treasuresByKeeper]);

  const activeProviderConfig = useMemo(() => {
    if (provider === 'carto') {
      if (!cartoKey) {
        return {
          id: 'carto' as MapProviderId,
          configured: false,
          url: '',
          attribution: '© CARTO · © OpenStreetMap contributors',
          missingKeyMessage:
            'Chưa cấu hình VITE_CARTO_BASEMAP_KEY. CARTO hiện yêu cầu API key khi dùng bên ngoài nền tảng CARTO.',
        };
      }
      return {
        id: 'carto' as MapProviderId,
        configured: true,
        url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoKey)}`,
        attribution: '© CARTO Voyager · © OpenStreetMap contributors',
        missingKeyMessage: null,
      };
    }

    if (provider === 'maptiler') {
      if (!maptilerKey) {
        return {
          id: 'maptiler' as MapProviderId,
          configured: false,
          url: '',
          attribution: '© MapTiler · © OpenStreetMap contributors',
          missingKeyMessage:
            'Chưa cấu hình VITE_MAPTILER_KEY. Vui lòng thiết lập khóa MapTiler để sử dụng lớp bản đồ này.',
        };
      }
      return {
        id: 'maptiler' as MapProviderId,
        configured: true,
        url: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${encodeURIComponent(maptilerKey)}`,
        attribution: '© MapTiler · © OpenStreetMap contributors',
        missingKeyMessage: null,
      };
    }

    return {
      id: 'osm' as MapProviderId,
      configured: true,
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors (ODbL)',
      missingKeyMessage: null,
    };
  }, [provider, cartoKey, maptilerKey]);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: VIETNAM_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true,
    });

    map.fitBounds(VIETNAM_BOUNDS, { padding: [20, 20] });
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Load / Switch Tile Layer with bounded retries & explicit error handling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }

    retryCountRef.current = 0;

    if (!activeProviderConfig.configured) {
      setTileState('error');
      setTileErrorMsg(activeProviderConfig.missingKeyMessage);
      return;
    }

    setTileState('loading');
    setTileErrorMsg(null);

    const layer = L.tileLayer(activeProviderConfig.url, {
      attribution: activeProviderConfig.attribution,
      maxZoom: 18,
      crossOrigin: true,
    });

    let loadedTileCount = 0;
    let errorTileCount = 0;

    layer.on('tileload', () => {
      loadedTileCount += 1;
      setTileState('loaded');
      setTileErrorMsg(null);
    });

    layer.on('tileerror', () => {
      errorTileCount += 1;
      if (loadedTileCount === 0 && errorTileCount >= 3) {
        if (retryCountRef.current < 2) {
          retryCountRef.current += 1;
          setTimeout(() => {
            layer.redraw();
          }, 800 * retryCountRef.current);
        } else {
          setTileState('offline');
          setTileErrorMsg(
            `${t.map.tileError} (${provider.toUpperCase()}) — Đã thử lại ${retryCountRef.current} lần.`,
          );
        }
      }
    });

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [activeProviderConfig, provider, reloadNonce, t.map.tileError]);

  // Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const imageByTreasureId = new Map(
      images.filter((i) => i.fileStatus === 'verified' && i.filePath).map((i) => [i.treasureId, i]),
    );

    const markerRefs = new Map<string, L.Marker>();

    for (const keeper of filteredKeepers) {
      const keeperTreasures = treasuresByKeeper.get(keeper.id) || [];
      const count = keeperTreasures.length;

      const icon = L.divIcon({
        className: 'd05-custom-marker',
        html: `<div style="display:flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 6px;border-radius:9999px;background:${
          keeper.kind === 'museum' ? '#0F1E33' : '#7A541C'
        };color:#FAF8F3;border:2px solid #DFC484;font-family:JetBrains Mono,monospace;font-size:11px;font-weight:700;box-shadow:0 3px 10px rgba(9,19,33,0.35);cursor:pointer;">${count}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([keeper.coordinates.lat, keeper.coordinates.lng], { icon });

      // Build rich popup DOM safely
      const popupEl = document.createElement('div');
      popupEl.className = 'bg-[#FAF8F3] text-[#1E242B]';

      const firstTreasureWithImg = keeperTreasures.find((tr) => imageByTreasureId.has(tr.id));
      const verifiedImg = firstTreasureWithImg
        ? imageByTreasureId.get(firstTreasureWithImg.id)
        : undefined;

      const headerHtml = `
        <div style="background:#0F1E33;color:#FAF8F3;padding:10px 12px;border-bottom:1px solid #C8A252;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#DFC484;">
            ${keeper.kind === 'museum' ? 'Bảo tàng công lập' : 'Di tích & Đơn vị lưu giữ'} · ${keeper.provinceOrCity}
          </div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;margin-top:2px;line-height:1.25;">
            ${keeper.officialName}
          </div>
        </div>
      `;

      const imgHtml = verifiedImg
        ? `<div style="height:110px;background:#111827;overflow:hidden;"><img src="${verifiedImg.filePath}" alt="${keeper.officialName}" style="width:100%;height:100%;object-fit:cover;" /></div>`
        : `<div style="padding:8px 12px;background:#F3EFE6;border-bottom:1px solid #E6DFD0;font-size:11px;color:#5B3E2A;">Lưu giữ ${count} hồ sơ hiện vật trên nền tảng (tọa độ xác minh)</div>`;

      const listItemsHtml = keeperTreasures
        .slice(0, 4)
        .map(
          (tr) => `
          <button data-treasure-id="${tr.id}" style="display:block;width:100%;text-align:left;padding:4px 0;font-size:11px;color:#0F1E33;border-bottom:1px dashed #E6DFD0;background:none;border-left:none;border-right:none;border-top:none;cursor:pointer;">
            <span style="font-weight:600;">${tr.officialName}</span>
            <span style="color:#7A541C;"> · ${
              tr.recognitionStatus === 'national_treasure' ? 'BVQG' : 'Di sản tiêu biểu'
            }</span>
          </button>`,
        )
        .join('');

      const moreNote =
        keeperTreasures.length > 4
          ? `<div style="font-size:10px;color:#6B7280;margin-top:4px;">+ ${keeperTreasures.length - 4} hồ sơ khác tại đơn vị</div>`
          : '';

      popupEl.innerHTML = `
        ${headerHtml}
        ${imgHtml}
        <div style="padding:10px 12px;">
          <p style="font-size:11px;color:#4B5563;margin:0 0 6px 0;"><strong>Địa chỉ công khai:</strong> ${keeper.publicAddress}</p>
          <p style="font-size:11px;color:#4B5563;margin:0 0 8px 0;"><strong>Số hồ sơ trên nền tảng:</strong> ${count}</p>
          <div style="margin-bottom:10px;">
            ${listItemsHtml}
            ${moreNote}
          </div>
          <button data-keeper-id="${keeper.id}" style="width:100%;background:#0F1E33;color:#FAF8F3;border:none;padding:7px 10px;font-size:11px;font-weight:600;cursor:pointer;">
            Mở trang Bảo tàng / Di tích →
          </button>
        </div>
      `;

      popupEl.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement;
        const tBtn = target.closest('[data-treasure-id]') as HTMLElement | null;
        if (tBtn) {
          const tid = tBtn.getAttribute('data-treasure-id');
          if (tid) navigate(buildPath(`/treasures/${tid}`));
          return;
        }
        const kBtn = target.closest('[data-keeper-id]') as HTMLElement | null;
        if (kBtn) {
          const kid = kBtn.getAttribute('data-keeper-id');
          if (kid) navigate(buildPath(`/museums/${kid}`));
        }
      });

      marker.bindPopup(popupEl);
      marker.on('click', () => setSelectedKeeperId(keeper.id));
      marker.addTo(markersLayer);
      markerRefs.set(keeper.id, marker);
    }

    if (selectedKeeperId && markerRefs.has(selectedKeeperId)) {
      const m = markerRefs.get(selectedKeeperId)!;
      map.setView(m.getLatLng(), Math.max(map.getZoom(), 11), { animate: true });
      m.openPopup();
    }
  }, [filteredKeepers, treasuresByKeeper, images, selectedKeeperId, buildPath, navigate]);

  const handleResetVietnamView = () => {
    setSelectedKeeperId(null);
    mapInstanceRef.current?.fitBounds(VIETNAM_BOUNDS, { padding: [20, 20] });
  };

  const handleFocusSelectedRegion = () => {
    if (filteredKeepers.length === 0) return;
    const latLngs = filteredKeepers.map(
      (k) => [k.coordinates.lat, k.coordinates.lng] as [number, number],
    );
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current?.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  };

  const handleReloadTiles = () => {
    setReloadNonce((n) => n + 1);
  };

  const selectedKeeper: KeeperInstitution | undefined = keepers.find(
    (k) => k.id === selectedKeeperId,
  );

  return (
    <div className="border border-[#D8CEB8] bg-white">
      {/* Map Controls & Filters Bar */}
      <div className="border-b border-[#E6DFD0] bg-[#FAF8F3] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#5B3E2A]">
            <Compass className="h-4 w-4 text-[#9A6E2A] shrink-0" />
            <span>{t.map.discoveryVsHoldingNote}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Basemap Selector */}
            <div className="flex items-center gap-1.5 border border-[#D8CEB8] bg-white px-2.5 py-1.5 text-xs">
              <Layers className="h-3.5 w-3.5 text-[#9A6E2A]" />
              <span className="text-[#4B5563]">{t.map.providerLabel}:</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as MapProviderId)}
                className="bg-transparent font-medium text-[#0F1E33] focus:outline-none cursor-pointer"
                aria-label={t.map.providerLabel}
              >
                <option value="osm">OpenStreetMap</option>
                <option value="carto">
                  CARTO Voyager {cartoKey ? '' : '(Cần API key)'}
                </option>
                <option value="maptiler">
                  MapTiler {maptilerKey ? '' : '(Cần API key)'}
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetVietnamView}
              className="inline-flex items-center gap-1.5 border border-[#D8CEB8] bg-white px-3 py-1.5 text-xs font-medium text-[#0F1E33] hover:bg-[#F3EFE6] cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-[#9A6E2A]" />
              <span>{t.map.resetView}</span>
            </button>

            <button
              type="button"
              onClick={handleFocusSelectedRegion}
              className="inline-flex items-center gap-1.5 border border-[#D8CEB8] bg-white px-3 py-1.5 text-xs font-medium text-[#0F1E33] hover:bg-[#F3EFE6] cursor-pointer"
            >
              <LocateFixed className="h-3.5 w-3.5 text-[#9A6E2A]" />
              <span>Về khu vực đang lọc</span>
            </button>
          </div>
        </div>

        {/* Synchronized Map Filters */}
        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-[#6B7280] absolute left-2.5 top-2.5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bảo tàng, địa điểm, bảo vật..."
                className="w-full border border-[#D8CEB8] bg-white pl-8 pr-2.5 py-1.5 text-xs text-[#1E242B] focus:outline-none focus:border-[#0F1E33]"
              />
            </div>

            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="border border-[#D8CEB8] bg-white px-2.5 py-1.5 text-xs text-[#1E242B] focus:outline-none"
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
              className="border border-[#D8CEB8] bg-white px-2.5 py-1.5 text-xs text-[#1E242B] focus:outline-none"
            >
              <option value="all">Bảo tàng & Di tích</option>
              <option value="museum">Bảo tàng công lập</option>
              <option value="heritage_site">Di tích & Khu bảo tồn</option>
            </select>

            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="border border-[#D8CEB8] bg-white px-2.5 py-1.5 text-xs text-[#1E242B] focus:outline-none"
            >
              <option value="all">Tất cả Thời kỳ lịch sử</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.order}. {p.name}
                </option>
              ))}
            </select>

            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="border border-[#D8CEB8] bg-white px-2.5 py-1.5 text-xs text-[#1E242B] focus:outline-none"
            >
              <option value="all">Tất cả Chất liệu</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tile Error / Offline Banner */}
        {(tileState === 'error' || tileState === 'offline') && (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-[#B45309]/40 bg-[#FEF3C7] px-3.5 py-2.5 text-xs text-[#78350F]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#9A3412]" />
              <div>
                <p className="font-semibold">
                  {tileState === 'offline' ? t.map.offlineMarkersOnly : t.map.tileError}
                </p>
                {tileErrorMsg && <p className="mt-0.5">{tileErrorMsg}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {provider !== 'osm' && (
                <button
                  type="button"
                  onClick={() => setProvider('osm')}
                  className="bg-[#0F1E33] px-3 py-1.5 text-xs font-medium text-[#FAF8F3] cursor-pointer"
                >
                  Chuyển về OpenStreetMap
                </button>
              )}
              <button
                type="button"
                onClick={handleReloadTiles}
                className="inline-flex items-center gap-1 border border-[#78350F]/40 bg-white px-3 py-1.5 text-xs font-medium text-[#78350F] cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>{t.map.reloadTiles}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Viewport + Institution List Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className={`${compact ? 'lg:col-span-8' : 'lg:col-span-8'} relative`}>
          <div
            ref={mapContainerRef}
            className={`w-full ${compact ? 'h-[420px]' : 'h-[560px]'} z-10`}
          />
          <div className="border-t border-[#E6DFD0] bg-[#FAF8F3] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5B3E2A]">
            <span>
              Trạng thái lớp nền:{' '}
              <strong>
                {tileState === 'loaded'
                  ? `Đã tải (${provider.toUpperCase()})`
                  : tileState === 'loading'
                    ? 'Đang tải ô bản đồ...'
                    : tileState === 'offline'
                      ? 'Mất kết nối lớp nền (giữ nguyên marker)'
                      : 'Chưa cấu hình khóa hoặc lỗi'}
              </strong>
            </span>
            <span>
              Hiển thị <strong className="tabular-nums">{filteredKeepers.length}</strong> địa điểm lưu giữ xác minh
            </span>
          </div>
        </div>

        {/* Synchronized Institution Directory */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#E6DFD0] bg-[#FAF8F3] flex flex-col max-h-[600px]">
          <div className="border-b border-[#E6DFD0] px-4 py-3 flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-[#0F1E33]">
              Đơn vị lưu giữ ({filteredKeepers.length})
            </h3>
            <span className="text-[11px] text-[#7A541C]">Nơi lưu giữ / Trưng bày</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E6DFD0]">
            {filteredKeepers.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B7280]">
                Không tìm thấy bảo tàng hoặc di tích phù hợp bộ lọc hiện tại.
              </div>
            ) : (
              filteredKeepers.map((k) => {
                const count = (treasuresByKeeper.get(k.id) || []).length;
                const active = selectedKeeper?.id === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedKeeperId(k.id)}
                    className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                      active ? 'bg-[#EBE4D5]' : 'hover:bg-[#F3EFE6]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif text-sm font-semibold text-[#0F1E33]">
                        {k.officialName}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#7A541C] tabular-nums shrink-0">
                        {count} hồ sơ
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#5B3E2A]">
                      {k.kind === 'museum' ? 'Bảo tàng' : 'Di tích'} · {k.provinceOrCity}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#6B7280] line-clamp-1">
                      {k.publicAddress}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
