import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Button from './Button';
import MobileMenu from './MobileMenu';

const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center hover:shadow-md transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">LT</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight">Land Tokenization</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-base font-medium">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/faq"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              FAQ
            </Link>
            <Link
              to="/team"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Team
            </Link>
            <Link
              to="/links"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Links
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="cursor-pointer">
              <Button className="hidden md:flex">
                Login
              </Button>
            </Link>
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
