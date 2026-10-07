import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { startSmoothScroll } from './lib/motion';
import { PageWipe } from './components/PageWipe';
import { CaseNav } from './components/CaseNav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FilmsPage } from './pages/FilmsPage';
import { PhotosPage } from './pages/PhotosPage';
import { AboutPage } from './pages/AboutPage';
import { BookPage } from './pages/BookPage';

export const App: React.FC = () => {
  useEffect(() => {
    startSmoothScroll();
  }, []);

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
    </PageWipe>
  );
};

export default App;
