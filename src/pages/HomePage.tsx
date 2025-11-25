import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import Hero from '../components/landing/Hero';
import SiteFooter from '../components/landing/SiteFooter';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;
