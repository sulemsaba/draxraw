import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { markBooted, setScrollLocked, startSmoothScroll } from './lib/motion';
import { loadYouTube } from './lib/youtube';
import { useSeo } from './lib/useSeo';
import { Preloader } from './components/Preloader';
import { PageWipe } from './components/PageWipe';
import { CaseNav } from './components/CaseNav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
const loadFilmsPage = () => import('./pages/FilmsPage');
const FilmsPage = lazy(() => loadFilmsPage().then((m) => ({ default: m.FilmsPage })));
const loadPhotosPage = () => import('./pages/PhotosPage');
const PhotosPage = lazy(() => loadPhotosPage().then((m) => ({ default: m.PhotosPage })));
const loadAboutPage = () => import('./pages/AboutPage');
const AboutPage = lazy(() => loadAboutPage().then((m) => ({ default: m.AboutPage })));
const loadBookPage = () => import('./pages/BookPage');
const BookPage = lazy(() => loadBookPage().then((m) => ({ default: m.BookPage })));
const loadWallpapersPage = () => import('./pages/WallpapersPage');
const WallpapersPage = lazy(() => loadWallpapersPage().then((m) => ({ default: m.WallpapersPage })));

export const App: React.FC = () => {
  useSeo();

  // The old-TV loading screen plays on the first visit of a session only
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('drax-seen');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    // Fetch YouTube's player code in the background, so films start fast
    const warm = window.setTimeout(() => {
      loadYouTube().catch(() => {});
      // fetch the other pages too, so moving around is instant
      [loadFilmsPage, loadPhotosPage, loadAboutPage, loadBookPage, loadWallpapersPage].forEach((load) => load().catch(() => {}));
    }, 2500);
    startSmoothScroll();
    if (loading) setScrollLocked(true);
    else markBooted();
    return () => window.clearTimeout(warm);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handOver = () => {
    setScrollLocked(false);
    markBooted();
    try {
      sessionStorage.setItem('drax-seen', '1');
    } catch {
      // private mode: it just plays again next time
    }
  };

  return (
    <PageWipe>
      <CaseNav />
      <div id="main">
        <main>
          {/* Other pages load on demand; the page transition covers the short wait */}
          <Suspense fallback={<div className="page" style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/wallpapers" element={<WallpapersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      {loading && <Preloader onRevealed={handOver} onExited={() => setLoading(false)} />}
    </PageWipe>
  );
};

export default App;
