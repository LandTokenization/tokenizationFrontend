import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import FAQ from '../components/landing/FAQ';
import SiteFooter from '../components/landing/SiteFooter';

const FAQPagePublic: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />
      <main className="flex-1">
        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
};

export default FAQPagePublic;
