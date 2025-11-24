import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from './utils';
import Button from './Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => (
  <>
    {isOpen && <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />}
    <div
      className={cn(
        'fixed top-0 right-0 z-50 h-full w-3/4 max-w-sm bg-background border-l shadow-lg transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex flex-col h-full p-6">
        <button onClick={onClose} className="self-end mb-8">
          <X className="h-6 w-6" />
        </button>
        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            onClick={onClose}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            to="/faq"
            onClick={onClose}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            FAQ
          </Link>
          <Link
            to="/team"
            onClick={onClose}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Team
          </Link>
          <Link
            to="/links"
            onClick={onClose}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            Links
          </Link>
          <div className="h-px bg-border my-2" />
          <Link to="/login" onClick={onClose} className="cursor-pointer">
            <Button className="w-full justify-start">
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  </>
);

export default MobileMenu;
