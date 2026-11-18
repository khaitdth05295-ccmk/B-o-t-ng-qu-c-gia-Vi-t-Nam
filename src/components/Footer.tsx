import React from 'react';
import { Link } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';

export const Footer: React.FC = () => {
  const { t, buildPath } = useHeritage();

  return (
    <footer className="border-t border-[#D8CEB8] bg-[#0F1E33] text-[#E6DFD0] mt-16">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#253C5C]">
          <div className="md:col-span-5 space-y-3">
            <p className="font-serif text-xl font-semibold text-[#FAF8F3]">{t.brandTitle}</p>
            <p className="text-sm text-[#C7BCA6] leading-relaxed max-w-md">
              {t.footer.legalBasis}
            </p>
            <p className="text-xs text-[#9AA8BC] leading-relaxed max-w-md">
              {t.footer.copyrightNote}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#DFC484]">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={buildPath('/encyclopedia')} className="hover:text-white transition-colors">
                  {t.nav.encyclopedia}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/map')} className="hover:text-white transition-colors">
                  {t.nav.map}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/periods')} className="hover:text-white transition-colors">
                  16 Thời kỳ lịch sử
                </Link>
              </li>
              <li>
                <Link to={buildPath('/timeline')} className="hover:text-white transition-colors">
                  {t.nav.timeline}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/museums')} className="hover:text-white transition-colors">
                  {t.nav.museums}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#DFC484]">
              Tư liệu & Quản trị
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={buildPath('/gallery')} className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/news')} className="hover:text-white transition-colors">
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/sources')} className="hover:text-white transition-colors">
                  {t.nav.sources}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/about')} className="hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to={buildPath('/admin')} className="text-[#DFC484] hover:text-white transition-colors">
                  {t.nav.admin} (Dữ liệu & Quyền công bố)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9AA8BC]">
          <span>© 2026 Bảo vật Quốc gia Việt Nam · Đề tài D05</span>
          <span>Chuẩn mô tả: Dublin Core 15 trường · Nguồn ưu tiên: dsvh.gov.vn, bvhttdl.gov.vn, vanban.chinhphu.vn</span>
        </div>
      </div>
    </footer>
  );
};
