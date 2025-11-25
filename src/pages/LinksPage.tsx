import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { ExternalLink } from 'lucide-react';

const LinksPage: React.FC = () => {
  const links = [
    {
      title: 'Documentation',
      description: 'Access comprehensive documentation and guides',
      url: '#',
      icon: '📖',
    },
    {
      title: 'GitHub Repository',
      description: 'View the source code on GitHub',
      url: '#',
      icon: '🔗',
    },
    {
      title: 'Whitepaper',
      description: 'Read the full technical whitepaper',
      url: '#',
      icon: '📄',
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      url: '#',
      icon: '💬',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-24 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Useful <span className="text-primary">Links</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Quick access to resources and documentation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 rounded-xl border bg-card shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{link.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {link.description}
                        </p>
                        <div className="flex items-center gap-2 text-primary text-sm">
                          <span>Visit</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LinksPage;
