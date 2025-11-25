import React, { useState } from 'react';
import { Leaf, ShieldCheck, Users, Sparkles } from 'lucide-react';
import Button from './Button';
import { useToast } from '../../context/ToastContext';
import './Hero.css';

const Hero: React.FC = () => {
  const { showInfo } = useToast();
  const [appLoading, setAppLoading] = useState(false);

  const handleAppComingSoon = async () => {
    setAppLoading(true);
    showInfo('App coming soon!');
    await new Promise(resolve => setTimeout(resolve, 800));
    setAppLoading(false);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <Sparkles className="h-4 w-4 mr-2 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-medium">Gelephu Mindfulness City, Pelsub Initiative</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Land <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-pulse">Tokenization</span> for Prosperity
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            Merging technology with social well-being. A novel mechanism to ensure equitable
            participation for landowners in the Gelephu Mindfulness City.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="h-12 px-8 text-base hover:scale-105 transition-transform duration-300"
              onClick={handleAppComingSoon}
              isLoading={appLoading}
            >
              App Coming Soon
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
              className="flex flex-col items-center text-center p-6 rounded-xl border bg-card shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fadeInUp cursor-pointer group"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
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