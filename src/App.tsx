import React, { useRef } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { SelectedWork } from './components/SelectedWork';
import './App.css';

export const App: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);

  return (
    <div className="draxraw-app">
      <Navigation navRef={navRef} />
      <main id="main-content">
        <Hero navRef={navRef} />
        <SelectedWork />
      </main>
    </div>
  );
};

export default App;
