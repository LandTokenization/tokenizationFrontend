import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import FAQ from '../components/landing/FAQ';
import Team from '../components/landing/Team';
import SiteFooter from '../components/landing/SiteFooter';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <About />
        <FAQ />
        <Team />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Home;
