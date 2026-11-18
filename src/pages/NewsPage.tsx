import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';

const CATEGORIES = [
  'Tất cả',
  'Công nhận bảo vật quốc gia',
  'Khảo cổ học',
  'Lịch sử Việt Nam',
  'Nghệ thuật và mỹ thuật',
  'Văn hóa',
  'Hoạt động bảo tàng',
  'Bảo tồn di sản',
  'Triển lãm',
  'Nghiên cứu chuyên ngành',
];

export const NewsPage: React.FC = () => {
  const { data, t, buildPath } = useHeritage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('Tất cả');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(
    searchParams.get('article'),
  );

  useEffect(() => {
    const a = searchParams.get('article');
    if (a) setActiveArticleId(a);
  }, [searchParams]);

  if (!data) return null;

  const { articles, sources, treasures } = data;
  const filtered = articles.filter((a) => category === 'Tất cả' || a.category === category);
  const activeArticle =
    articles.find((a) => a.id === activeArticleId) || filtered[0] || articles[0];
  const activeSource = sources.find((s) => s.id === activeArticle?.sourceId);
  const relatedTreasures = treasures.filter((tr) =>
    activeArticle?.relatedTreasureIds.includes(tr.id),
  );
  const relatedArticles = articles.filter((a) =>
    activeArticle?.relatedArticleIds.includes(a.id),
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10 space-y-8">
      <div className="border-b border-[#D8CEB8] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A541C]">
          Thông tin học thuật & Di sản văn hóa
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#0F1E33]">{t.nav.news}</h1>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              setActiveArticleId(null);
            }}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
              category === cat
                ? 'border-[#0F1E33] bg-[#0F1E33] text-[#FAF8F3]'
                : 'border-[#D8CEB8] bg-white text-[#1E242B] hover:border-[#9A6E2A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Article List */}
        <aside className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="border border-[#D8CEB8] bg-white p-6 text-xs text-[#6B7280]">
              Chưa có bài viết thuộc chuyên mục này.
            </div>
          ) : (
            filtered.map((art) => {
              const selected = activeArticle?.id === art.id;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => {
                    setActiveArticleId(art.id);
                    setSearchParams({ article: art.id });
                  }}
                  className={`w-full text-left border p-4 transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#0F1E33] bg-[#F3EFE6]'
                      : 'border-[#D8CEB8] bg-white hover:border-[#9A6E2A]'
                  }`}
                >
                  <p className="text-[11px] font-medium text-[#7A541C]">
                    {art.category} · {art.publishedDate}
                  </p>
                  <h2 className="mt-1 font-serif text-lg font-semibold text-[#0F1E33]">
                    {art.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-[#4B5563] line-clamp-2">{art.summary}</p>
                </button>
              );
            })
          )}
        </aside>

        {/* Active Article Reading Column */}
        {activeArticle && (
          <main className="lg:col-span-7 border border-[#D8CEB8] bg-white p-6 lg:p-8 space-y-6">
            <div className="border-b border-[#EFE9DC] pb-4">
              <p className="text-xs font-semibold text-[#7A541C]">
                {activeArticle.category} · {activeArticle.publishedDate}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#0F1E33] leading-snug">
                {activeArticle.title}
              </h2>
              <p className="mt-2 text-xs text-[#5B3E2A]">
                Tác giả / Đơn vị biên soạn: <strong>{activeArticle.authorOrAgency}</strong>
              </p>
            </div>

            <p className="font-serif italic text-lg text-[#3A2618] leading-relaxed">
              {activeArticle.summary}
            </p>

            <div className="space-y-4 text-sm sm:text-[15px] text-[#1E242B] leading-[1.8]">
              {activeArticle.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {activeSource && (
              <div className="border-t border-[#EFE9DC] pt-4 text-xs">
                <p className="font-semibold text-[#5B3E2A]">Nguồn tham khảo chính:</p>
                <a
                  href={activeSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[#0F1E33] underline hover:text-[#9A6E2A]"
                >
                  <span>
                    [{activeSource.code}] {activeSource.name} — {activeSource.documentTitle}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {relatedTreasures.length > 0 && (
              <div className="border-t border-[#EFE9DC] pt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A541C]">
                  Bảo vật liên quan trong bài viết
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedTreasures.map((tr) => (
                    <Link
                      key={tr.id}
                      to={buildPath(`/treasures/${tr.id}`)}
                      className="border border-[#D8CEB8] bg-[#FAF8F3] px-3 py-1.5 text-xs font-medium text-[#0F1E33] hover:border-[#9A6E2A]"
                    >
                      {tr.officialName}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="border-t border-[#EFE9DC] pt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A541C]">
                  Bài viết liên quan
                </p>
                <ul className="space-y-1.5 text-xs">
                  {relatedArticles.map((ra) => (
                    <li key={ra.id}>
                      <button
                        type="button"
                        onClick={() => setActiveArticleId(ra.id)}
                        className="text-left text-[#0F1E33] underline hover:text-[#9A6E2A] cursor-pointer"
                      >
                        {ra.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
};
