import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

const TeamCTA: React.FC = () => (
  <section className="py-24 bg-muted/50">
    <div className="container mx-auto px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <Badge variant="secondary" className="px-4 py-1">
          Our Team
        </Badge>
        
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Meet Our <span className="text-primary">Visionary Team</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the dedicated professionals behind GMC's tokenization initiative. Our multidisciplinary team brings together expertise in policy, economics, technology, and community engagement to create a fair and sustainable future for Gelephu.
          </p>
        </div>

        <Link to="/team">
          <Button size="lg" className="h-12 px-8 text-base cursor-pointer">
            View Full Team
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default TeamCTA;
