import React, { useRef } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { SelectedWork } from './components/SelectedWork';
import './App.css';

export const App: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);

  return (
    <div className="draxraw-app">
      {/* 35mm Physical Film Grain Texture Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* 1. Navigation */}
      <Navigation navRef={navRef} />

      {/* Main Experience */}
      <main id="main-content">
        {/* 2. Hero & Motion */}
        <Hero navRef={navRef} />

        {/* 3. Transition into Selected Work & First 3 Film Projects */}
        <SelectedWork />
      </main>
    </div>
  );
};

export default App;
