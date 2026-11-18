import React, { useState } from 'react';
import { ArrowRight, BookOpen, Compass, ExternalLink, Landmark, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InteractiveHeritageMap } from '../components/InteractiveHeritageMap';
import { TreasureCard } from '../components/TreasureCard';
import { useHeritage } from '../context/HeritageContext';
import type { TreasureRecord } from '../types/heritage';

export const HomePage: React.FC = () => {
  const { data, t, buildPath } = useHeritage();
  const [quickViewItem, setQuickViewItem] = useState<TreasureRecord | null>(null);

  if (!data) return null;

  const { stats, treasures, periods, cultures, materials, keepers, articles, sources } = data;
  const featuredTreasures = treasures.filter((x) => x.recognitionStatus === 'national_treasure').slice(0, 6);
  const featuredKeepers = keepers.slice(0, 6);
  const researchArticles = articles.filter((a) =>
    ['Khảo cổ học', 'Lịch sử Việt Nam', 'Nghệ thuật và mỹ thuật', 'Hoạt động bảo tàng'].includes(a.category),
  );
  const newsArticles = articles.filter((a) =>
    ['Công nhận bảo vật quốc gia', 'Bảo tồn di sản', 'Triển lãm', 'Văn hóa'].includes(a.category),
  );
  const highlightedSources = sources.slice(0, 6);

  return (
    <div>
      {/* Grand Institutional Hero Banner */}
      <section className="relative bg-[#0F1E33] text-[#FAF8F3] border-b border-[#9A6E2A]/60">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#DFC484]">
                {t.hero.kicker}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F3] text-balance leading-[1.08]">
                {t.hero.title}
              </h1>
              <p className="font-serif italic text-xl sm:text-2xl text-[#EBD8AC] max-w-2xl leading-relaxed">
                “{t.hero.subtitle}”
              </p>
              <p className="text-sm text-[#C7BCA6] max-w-2xl leading-relaxed">
                Hệ thống bách khoa toàn thư số kết hợp bản đồ địa lý tương tác nơi lưu giữ Bảo vật Quốc gia Việt Nam theo Luật Di sản văn hóa số 45/2024/QH15 và chuẩn mô tả Dublin Core.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={buildPath('/encyclopedia')}
                  className="inline-flex items-center gap-2 bg-[#C8A252] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#091321] hover:bg-[#DFC484] transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{t.hero.ctaExplore}</span>
                </Link>
                <Link
                  to={buildPath('/map')}
                  className="inline-flex items-center gap-2 border border-[#C8A252]/70 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF8F3] hover:bg-[#182D49] transition-colors"
                >
                  <Compass className="h-4 w-4 text-[#DFC484]" />
                  <span>{t.hero.ctaMap}</span>
                </Link>
              </div>
            </div>

            {/* Right Curatorial Panel: Independent Real Metrics */}
            <div className="lg:col-span-5 border border-[#C8A252]/40 bg-[#162944]/90 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#253C5C] pb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#DFC484]">
                  01. Tổng quan số liệu thực tế
                </span>
                <span className="font-mono text-[11px] text-[#9AA8BC]">Mốc 02/2026</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#253C5C] bg-[#0F1E33]/70 p-3.5">
                  <p className="font-serif text-3xl font-bold text-[#DFC484] tabular-nums">
                    {stats.officialRecognizedTotal}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#FAF8F3]">
                    {t.stats.officialTotalLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-[#9AA8BC] leading-snug">
                    {t.stats.officialTotalSub}
                  </p>
                </div>

                <div className="border border-[#253C5C] bg-[#0F1E33]/70 p-3.5">
                  <p className="font-serif text-3xl font-bold text-[#FAF8F3] tabular-nums">
                    {stats.platformStoredTotal}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#FAF8F3]">
                    {t.stats.storedTotalLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-[#9AA8BC] leading-snug">
                    {stats.nationalTreasuresStored} BVQG · {stats.representativeArtifactsStored} Di sản tiêu biểu
                  </p>
                </div>

                <div className="border border-[#253C5C] bg-[#0F1E33]/70 p-3.5">
                  <p className="font-serif text-3xl font-bold text-[#FAF8F3] tabular-nums">
                    {stats.verifiedRecords}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#FAF8F3]">
                    {t.stats.verifiedTotalLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-[#9AA8BC] leading-snug">
                    {stats.totalSourcesCount} nguồn đối chiếu độc lập
                  </p>
                </div>

                <div className="border border-[#253C5C] bg-[#0F1E33]/70 p-3.5">
                  <p className="font-serif text-3xl font-bold text-[#FAF8F3] tabular-nums">
                    {stats.totalKeepersCount}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#FAF8F3]">
                    {t.stats.keepersLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-[#9AA8BC] leading-snug">
                    Định vị tọa độ công khai xác minh
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#C7BCA6] leading-relaxed border-t border-[#253C5C] pt-3">
                Lưu ý minh bạch dữ liệu: Số lượng <strong>357</strong> là tổng số bảo vật & nhóm hiện vật được Thủ tướng công nhận qua 14 đợt (tính đến 02/2026); nền tảng chỉ hiển thị và đếm chính xác số hồ sơ đã kiểm chứng nhập vào cơ sở dữ liệu ({stats.platformStoredTotal} hồ sơ).
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 space-y-16 py-12">
        {/* 2. Bảo vật nổi bật */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8CEB8] pb-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                02. Hiện vật tiêu biểu đã công nhận
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0F1E33]">
                Bảo vật Quốc gia nổi bật
              </h2>
            </div>
            <Link
              to={buildPath('/encyclopedia')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>Xem toàn bộ Bách khoa toàn thư</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTreasures.map((tr) => (
              <TreasureCard key={tr.id} treasure={tr} onQuickView={setQuickViewItem} />
            ))}
          </div>
        </section>

        {/* 3. Khám phá theo thời kỳ (16 thời kỳ) */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8CEB8] pb-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                03. Phân kỳ lịch sử Việt Nam
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0F1E33]">
                Khám phá theo 16 thời kỳ lịch sử
              </h2>
            </div>
            <Link
              to={buildPath('/periods')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>Mở trang 16 Thời kỳ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {periods.map((period) => {
              const count = treasures.filter((tr) => tr.periodIds.includes(period.id)).length;
              return (
                <Link
                  key={period.id}
                  to={buildPath(`/periods?period=${encodeURIComponent(period.id)}`)}
                  className="border border-[#D8CEB8] bg-white p-4 hover:border-[#9A6E2A] hover:bg-[#FAF8F3] transition-colors flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#7A541C]">
                      <span>{String(period.order).padStart(2, '0')}</span>
                      <span className="tabular-nums">{count} hồ sơ</span>
                    </div>
                    <h3 className="mt-1.5 font-serif text-base font-semibold text-[#0F1E33]">
                      {period.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#6B7280]">{period.dateRange}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4 & 5. Khám phá theo văn hóa & chất liệu */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 border border-[#D8CEB8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
              04. Nền văn hóa khảo cổ & lịch sử
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0F1E33] mb-4">
              Khám phá theo văn hóa
            </h2>
            <div className="divide-y divide-[#EFE9DC]">
              {cultures.map((c) => {
                const count = treasures.filter((tr) => tr.cultureId === c.id).length;
                return (
                  <Link
                    key={c.id}
                    to={buildPath(`/encyclopedia?culture=${encodeURIComponent(c.id)}`)}
                    className="py-3 flex items-start justify-between gap-4 hover:bg-[#FAF8F3] px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="font-serif text-base font-semibold text-[#0F1E33]">{c.name}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {c.timeSpan} · {c.region}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#7A541C] tabular-nums shrink-0 mt-1">
                      {count} hồ sơ
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 border border-[#D8CEB8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
              05. Chất liệu & Kỹ nghệ chế tác
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0F1E33] mb-4">
              Khám phá theo chất liệu
            </h2>
            <div className="divide-y divide-[#EFE9DC]">
              {materials.map((m) => {
                const count = treasures.filter((tr) => tr.materialIds.includes(m.id)).length;
                return (
                  <Link
                    key={m.id}
                    to={buildPath(`/encyclopedia?material=${encodeURIComponent(m.id)}`)}
                    className="py-3 flex items-start justify-between gap-4 hover:bg-[#FAF8F3] px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="font-serif text-base font-semibold text-[#0F1E33]">{m.name}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{m.description}</p>
                    </div>
                    <span className="font-mono text-xs text-[#7A541C] tabular-nums shrink-0 mt-1">
                      {count} hồ sơ
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Bản đồ địa điểm lưu giữ (Chức năng cốt lõi D05) */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8CEB8] pb-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                06. Trọng tâm đề tài D05
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0F1E33]">
                Bản đồ địa điểm lưu giữ Bảo vật Quốc gia
              </h2>
            </div>
            <Link
              to={buildPath('/map')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>Mở bản đồ toàn màn hình & bộ lọc nâng cao</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <InteractiveHeritageMap compact />
        </section>

        {/* 7. Bảo tàng và di tích tiêu biểu */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8CEB8] pb-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                07. Hệ thống đơn vị bảo quản & trưng bày
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0F1E33]">
                Bảo tàng và Di tích tiêu biểu
              </h2>
            </div>
            <Link
              to={buildPath('/museums')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>Xem tất cả {keepers.length} đơn vị</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredKeepers.map((k) => {
              const count = treasures.filter((tr) => tr.currentKeeperId === k.id).length;
              return (
                <Link
                  key={k.id}
                  to={buildPath(`/museums/${k.id}`)}
                  className="border border-[#D8CEB8] bg-white p-5 hover:border-[#9A6E2A] transition-colors flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#7A541C]">
                      <span>{k.kind === 'museum' ? 'Bảo tàng công lập' : 'Di tích lưu giữ'}</span>
                      <span>{k.provinceOrCity}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-semibold text-[#0F1E33]">
                      {k.officialName}
                    </h3>
                    <p className="mt-2 text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                      {k.introduction}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#EFE9DC] flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-[#5B3E2A]">
                      <Landmark className="h-3.5 w-3.5 text-[#9A6E2A]" />
                      <span className="tabular-nums font-medium">{count} hồ sơ lưu giữ</span>
                    </span>
                    <span className="font-semibold text-[#0F1E33]">Chi tiết →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 8. Các câu chuyện lịch sử */}
        <section className="border border-[#D8CEB8] bg-[#F3EFE6] p-6 lg:p-8">
          <div className="border-b border-[#D8CEB8] pb-4 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
              08. Di sản qua lăng kính lịch sử
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0F1E33]">
              Các câu chuyện lịch sử gắn với bảo vật
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'bv-01',
                kicker: 'Văn minh Sông Hồng',
                title: 'Hành trình từ bờ đê Ngọc Lũ đến biểu tượng văn hóa Đông Sơn',
                excerpt:
                  'Phát hiện tình cờ năm 1893–1894 tại Hà Nam đã mở ra bức tranh toàn cảnh về nghi lễ, âm nhạc và luyện kim đồng thau của cư dân Việt cổ cách đây hơn hai thiên niên kỷ.',
              },
              {
                id: 'bv-12',
                kicker: 'Hiền tài nguyên khí quốc gia',
                title: '337 năm khoa cử Đại Việt khắc ghi trên 82 tấm bia đá Văn Miếu',
                excerpt:
                  'Từ khoa thi năm 1442 đến năm 1779, 82 Bia Tiến sĩ trên lưng rùa đá không chỉ là Bảo vật Quốc gia mà còn được UNESCO vinh danh Di sản Tư liệu Thế giới.',
              },
              {
                id: 'bv-19',
                kicker: 'Biểu tượng sơn hà thống nhất',
                title: '162 hình tượng đúc nổi trên Cửu Đỉnh Hoàng thành Huế',
                excerpt:
                  'Đúc năm 1835–1837 dưới triều Minh Mạng, chín chiếc đỉnh đồng trước Thế Tổ Miếu lưu giữ bản đồ thiên nhiên, sông núi và chủ quyền biển đảo Việt Nam bằng đồng.',
              },
            ].map((story) => (
              <Link
                key={story.id}
                to={buildPath(`/treasures/${story.id}`)}
                className="bg-white border border-[#D8CEB8] p-5 hover:border-[#9A6E2A] transition-colors flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A541C]">
                    {story.kicker}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-[#0F1E33] leading-snug">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#4B5563] leading-relaxed">{story.excerpt}</p>
                </div>
                <span className="text-xs font-semibold text-[#0F1E33]">Đọc hồ sơ bảo vật →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 9 & 10. Bài viết nghiên cứu & Tin tức di sản */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <div className="flex items-end justify-between border-b border-[#D8CEB8] pb-3 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                  09. Chuyên khảo học thuật
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0F1E33]">
                  Bài viết nghiên cứu
                </h2>
              </div>
              <Link to={buildPath('/news')} className="text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]">
                Tất cả →
              </Link>
            </div>
            <div className="space-y-4">
              {researchArticles.slice(0, 4).map((art) => (
                <Link
                  key={art.id}
                  to={buildPath(`/news?article=${art.id}`)}
                  className="block border border-[#D8CEB8] bg-white p-4 hover:border-[#9A6E2A] transition-colors"
                >
                  <div className="text-[11px] text-[#7A541C] font-medium">
                    {art.category} · {art.publishedDate}
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-[#0F1E33]">
                    {art.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#4B5563] line-clamp-2">{art.summary}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-end justify-between border-b border-[#D8CEB8] pb-3 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                  10. Pháp lý & Hoạt động bảo tồn
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0F1E33]">
                  Tin tức di sản
                </h2>
              </div>
              <Link to={buildPath('/news')} className="text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]">
                Tất cả →
              </Link>
            </div>
            <div className="space-y-4">
              {newsArticles.slice(0, 4).map((art) => (
                <Link
                  key={art.id}
                  to={buildPath(`/news?article=${art.id}`)}
                  className="block border border-[#D8CEB8] bg-white p-4 hover:border-[#9A6E2A] transition-colors"
                >
                  <div className="text-[11px] text-[#7A541C] font-medium">
                    {art.category} · {art.publishedDate}
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-[#0F1E33]">
                    {art.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#4B5563] line-clamp-2">{art.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Nguồn tài liệu nổi bật */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#D8CEB8] pb-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
                11. Chuẩn xác & Có kiểm chứng
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0F1E33]">
                Nguồn tài liệu nổi bật ({sources.length} nguồn độc lập)
              </h2>
            </div>
            <Link
              to={buildPath('/sources')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1E33] hover:text-[#9A6E2A]"
            >
              <span>Xem Thư viện nguồn tham khảo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlightedSources.map((src) => (
              <div key={src.id} className="border border-[#D8CEB8] bg-white p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7A541C]">
                    <span>{src.code}</span>
                    <span className="inline-flex items-center gap-1 text-[#14532D]">
                      <ShieldCheck className="h-3 w-3" /> Đã xác minh
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-serif text-base font-semibold text-[#0F1E33]">
                    {src.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#4B5563] line-clamp-2">{src.documentTitle}</p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0F1E33] underline hover:text-[#9A6E2A]"
                >
                  <span className="truncate">{src.url}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      {quickViewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#091321]/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-2xl w-full bg-[#FAF8F3] border border-[#9A6E2A] p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#D8CEB8] pb-3">
              <div>
                <p className="font-mono text-xs text-[#7A541C]">
                  {quickViewItem.code} ·{' '}
                  {quickViewItem.recognitionStatus === 'national_treasure'
                    ? t.labels.nationalTreasure
                    : t.labels.representativeHeritage}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#0F1E33]">
                  {quickViewItem.officialName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewItem(null)}
                className="border border-[#D8CEB8] bg-white px-3 py-1 text-xs font-medium text-[#0F1E33] cursor-pointer"
              >
                {t.labels.close}
              </button>
            </div>
            <p className="text-sm text-[#1E242B] leading-relaxed">{quickViewItem.summary}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#E6DFD0] pt-3 text-xs">
              <div>
                <dt className="font-semibold text-[#5B3E2A]">{t.labels.dating}</dt>
                <dd className="text-[#1E242B] mt-0.5">{quickViewItem.dating}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">{t.labels.keeper}</dt>
                <dd className="text-[#1E242B] mt-0.5">{quickViewItem.archival.currentHoldingInstitution}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">{t.labels.discoveryPlace}</dt>
                <dd className="text-[#1E242B] mt-0.5">{quickViewItem.discoveryPlace}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5B3E2A]">{t.labels.decision}</dt>
                <dd className="text-[#1E242B] mt-0.5">
                  {quickViewItem.decisionNumber
                    ? `${quickViewItem.decisionNumber} (Đợt ${quickViewItem.batchNumber})`
                    : 'Chưa có quyết định công nhận BVQG'}
                </dd>
              </div>
            </dl>
            <div className="pt-3 border-t border-[#D8CEB8] flex justify-end gap-3">
              <Link
                to={buildPath(`/treasures/${quickViewItem.id}`)}
                onClick={() => setQuickViewItem(null)}
                className="inline-flex items-center gap-2 bg-[#0F1E33] px-4 py-2 text-xs font-semibold text-[#FAF8F3]"
              >
                <Layers className="h-3.5 w-3.5 text-[#DFC484]" />
                <span>{t.labels.viewDetail}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
