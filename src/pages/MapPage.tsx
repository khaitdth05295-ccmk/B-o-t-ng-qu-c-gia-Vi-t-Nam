import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveHeritageMap } from '../components/InteractiveHeritageMap';
import { useHeritage } from '../context/HeritageContext';

export const MapPage: React.FC = () => {
  const { t } = useHeritage();
  const [searchParams] = useSearchParams();
  const initialKeeperId = searchParams.get('keeper') || undefined;

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-6">
      <div className="border-b border-[#D8CEB8] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Dự án D05 · Chức năng cốt lõi
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">{t.map.title}</h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-3xl leading-relaxed">
          Bản đồ địa lý thực tế bằng Leaflet hỗ trợ chuyển đổi nhà cung cấp bản đồ nền (OpenStreetMap, CARTO Voyager, MapTiler), hiển thị tọa độ công khai đã xác minh của các bảo tàng và di tích lưu giữ Bảo vật Quốc gia trên toàn quốc.
        </p>
      </div>

      <InteractiveHeritageMap initialKeeperId={initialKeeperId} />
    </div>
  );
};
