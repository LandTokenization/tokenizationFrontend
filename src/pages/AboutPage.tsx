import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import About from '../components/landing/About';
import SiteFooter from '../components/landing/SiteFooter';

const AboutPagePublic: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />
      <main className="flex-1">
        <About />
      </main>
      <SiteFooter />
    </div>
  );
};

export default AboutPagePublic;
