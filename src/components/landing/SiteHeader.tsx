import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Button from './Button';
import MobileMenu from './MobileMenu';
import { useToast } from '../../context/ToastContext';

const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showInfo } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSmoothScroll = (targetId: string) => {
    if (location.pathname === '/') {
      // Already on home page, smooth scroll to section
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // On another page, navigate to home and then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  const handleDocumentation = () => {
    showInfo('Opening documentation...');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:shadow-md transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">LT</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Land Tokenization</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => handleSmoothScroll('about')}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              About
            </button>
            <button
              onClick={() => handleSmoothScroll('faq')}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              FAQ
            </button>
            <Link to="/team" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              Team
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden md:flex border-2"
              onClick={handleDocumentation}
            >
              Documentation
            </Button>
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
