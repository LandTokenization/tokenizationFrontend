import React from 'react';

const SiteFooter: React.FC = () => (
  <footer className="border-t border-border/40 bg-background py-12 md:py-16">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2 space-y-4">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Pelsup</span>
          </a>
          <p className="text-muted-foreground max-w-xs">
            Empowering landowners and citizens through the Gelephu Mindfulness City token
            economy.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Tokenomics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Governance
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Marketplace
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Roadmap
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/40 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Land Tokenization / GMC Initiative. All rights reserved.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            LinkedIn
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Discord
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
