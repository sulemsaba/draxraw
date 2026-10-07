import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { markBooted, setScrollLocked, startSmoothScroll } from './lib/motion';
import { Preloader } from './components/Preloader';
import { PageWipe } from './components/PageWipe';
import { CaseNav } from './components/CaseNav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FilmsPage } from './pages/FilmsPage';
import { PhotosPage } from './pages/PhotosPage';
import { AboutPage } from './pages/AboutPage';
import { BookPage } from './pages/BookPage';

export const App: React.FC = () => {
  // The old-TV loading screen plays once per visit
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startSmoothScroll();
    setScrollLocked(true);
  }, []);

  const handOver = () => {
    setScrollLocked(false);
    markBooted();
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
