import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeritageAssistantWidget } from './components/HeritageAssistantWidget';
import { HeritageProvider, useHeritage } from './context/HeritageContext';
import { SUPPORTED_LOCALES } from './data/translationsData';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { MuseumsPage } from './pages/MuseumsPage';
import { NewsPage } from './pages/NewsPage';
import { PeriodsPage } from './pages/PeriodsPage';
import { SourcesPage } from './pages/SourcesPage';
import { TimelinePage } from './pages/TimelinePage';
import { TreasureDetailPage } from './pages/TreasureDetailPage';

const AppShell: React.FC = () => {
  const { loading, error, reloadData } = useHeritage();

  const renderLocaleRoutes = (prefix: string) => (
    <>
      <Route path={`${prefix}/`} element={<HomePage />} />
      <Route path={`${prefix}/encyclopedia`} element={<EncyclopediaPage />} />
      <Route path={`${prefix}/treasures/:id`} element={<TreasureDetailPage />} />
      <Route path={`${prefix}/periods`} element={<PeriodsPage />} />
      <Route path={`${prefix}/map`} element={<MapPage />} />
      <Route path={`${prefix}/timeline`} element={<TimelinePage />} />
      <Route path={`${prefix}/museums`} element={<MuseumsPage />} />
      <Route path={`${prefix}/museums/:id`} element={<MuseumsPage />} />
      <Route path={`${prefix}/gallery`} element={<GalleryPage />} />
      <Route path={`${prefix}/news`} element={<NewsPage />} />
      <Route path={`${prefix}/sources`} element={<SourcesPage />} />
      <Route path={`${prefix}/about`} element={<AboutPage />} />
      <Route path={`${prefix}/admin`} element={<AdminPage />} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#1E242B]">
      <Header />
      <main className="flex-1">
        {loading ? (
          <div className="mx-auto max-w-[1400px] px-4 py-20 text-center space-y-3">
            <p className="font-serif text-2xl text-[#0F1E33]">
              Đang tải Cơ sở dữ liệu Bảo vật Quốc gia Việt Nam...
            </p>
            <p className="text-xs text-[#5B3E2A]">Dự án D05 · Chuẩn mô tả Dublin Core</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-lg px-4 py-20 text-center space-y-4">
            <p className="font-serif text-2xl text-[#9A3412]">Không thể kết nối máy chủ dữ liệu</p>
            <p className="text-xs text-[#4B5563]">{error}</p>
            <button
              type="button"
              onClick={reloadData}
              className="bg-[#0F1E33] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <Routes>
            {/* Default Vietnamese root routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/treasures/:id" element={<TreasureDetailPage />} />
            <Route path="/periods" element={<PeriodsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/museums" element={<MuseumsPage />} />
            <Route path="/museums/:id" element={<MuseumsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Explicit 10-language prefix routes (/vi/, /en/, /fr/, /zh-cn/, /zh-tw/, /ja/, /ko/, /es/, /ru/, /de/) */}
            {SUPPORTED_LOCALES.map((loc) => (
              <React.Fragment key={loc.code}>
                <Route path={`/${loc.code}`} element={<Navigate to={`/${loc.code}/`} replace />} />
                {renderLocaleRoutes(`/${loc.code}`)}
              </React.Fragment>
            ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
      <Footer />
      <HeritageAssistantWidget />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <HeritageProvider>
        <AppShell />
      </HeritageProvider>
    </BrowserRouter>
  );
}
