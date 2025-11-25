import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import Hero from '../components/landing/Hero';
import SiteFooter from '../components/landing/SiteFooter';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-sans selection:bg-primary/20">
      <div className="medusa-fallback">
        <div className="bg"></div>
        <div className="message">Your browser doesn't support the `shape()` function yet.</div>
      </div>

      <div className="medusa-main">
        <div className="medusa-wrapper">
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
          <div className="medusa">
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
            <div className="medusa-inner"></div>
          </div>
        </div>
      </div>

      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Home;

