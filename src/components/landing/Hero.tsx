import React, { useState } from 'react';
import { ArrowRight, Leaf, ShieldCheck, Users } from 'lucide-react';
import Button from './Button';
import { useNavigation } from '../../lib/hooks';
import { useToast } from '../../context/ToastContext';

const Hero: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { showInfo } = useToast();
  const [frameworkLoading, setFrameworkLoading] = useState(false);
  const [whitepaperLoading, setWhitepaperLoading] = useState(false);

  const handleFramework = async () => {
    setFrameworkLoading(true);
    showInfo('Loading framework documentation...');
    await new Promise(resolve => setTimeout(resolve, 800));
    navigateTo('/dashboard', 300);
    setFrameworkLoading(false);
  };

  const handleWhitepaper = async () => {
    setWhitepaperLoading(true);
    showInfo('Opening whitepaper in new window...');
    await new Promise(resolve => setTimeout(resolve, 500));
    window.open('https://example.com/whitepaper', '_blank');
    setWhitepaperLoading(false);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50">
            <span className="font-medium">Gelephu Mindfulness City Initiative</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Fair Compensation through <span className="text-primary">Tokenization</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Merging technology with social well-being. A novel mechanism to ensure equitable
            participation for landowners in the Gelephu Mindfulness City.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="h-12 px-8 text-base"
              onClick={handleFramework}
              isLoading={frameworkLoading}
            >
              Explore the Framework
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-base"
              onClick={handleWhitepaper}
              isLoading={whitepaperLoading}
            >
              Read the Whitepaper
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Leaf,
              title: 'Sustainable Development',
              desc: 'Integrating mindful principles with modern infrastructure growth.',
            },
            {
              icon: ShieldCheck,
              title: 'Fair Governance',
              desc: 'Transparent execution with established policy and valuation frameworks.',
            },
            {
              icon: Users,
              title: 'Shared Prosperity',
              desc: 'Equitable participation for landowners and citizens in the token economy.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-xl border bg-card shadow-sm"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;