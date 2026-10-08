import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { markBooted, setScrollLocked, startSmoothScroll } from './lib/motion';
import { loadYouTube } from './lib/youtube';
import { Preloader } from './components/Preloader';
import { PageWipe } from './components/PageWipe';
import { CaseNav } from './components/CaseNav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FilmsPage } from './pages/FilmsPage';
import { PhotosPage } from './pages/PhotosPage';
import { AboutPage } from './pages/AboutPage';
import { BookPage } from './pages/BookPage';
import { WallpapersPage } from './pages/WallpapersPage';

export const App: React.FC = () => {
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
    const warm = window.setTimeout(() => loadYouTube().catch(() => {}), 2500);
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/wallpapers" element={<WallpapersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      {loading && <Preloader onRevealed={handOver} onExited={() => setLoading(false)} />}
    </PageWipe>
  );
};

export default App;
