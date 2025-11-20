import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Button from './Button';
import MobileMenu from './MobileMenu';

const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Pelsup</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="#team" className="text-muted-foreground hover:text-primary transition-colors">
              Team
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex border-2">
              Documentation
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default SiteHeader;
