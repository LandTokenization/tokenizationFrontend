import React from 'react';
import { Leaf } from 'lucide-react';
import Badge from './Badge';

const About: React.FC = () => (
  <section id="about" className="py-24 bg-transparent">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="outline" className="px-4 py-1">
            Our Mission
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Bridging Tradition & <span className="text-primary">Technology</span>
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              The Gelephu Mindfulness City (GMC) represents a visionary leap forward,
              integrating mindful, sustainable, and inclusive development principles.
            </p>
            <p>
              Tokenization has emerged as a novel mechanism to ensure fair compensation
              and equitable participation of landowners affected by land acquisition. This
              idea reflects an aspiration to merge technology with social well-being and
              shared prosperity.
            </p>
            <p className="font-medium text-foreground">
              Our mission is to establish a comprehensive framework and a prototype system
              that integrates governance, technology, and socio-economic value—linking
              token issuance, valuation, and trading to measurable indicators of GMC's
              development.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border shadow-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-center p-8">
              <Leaf className="h-24 w-24 text-primary mx-auto mb-4" />
              <p className="font-medium text-lg">GMC Vision</p>
              <p className="text-sm text-muted-foreground">Harmonizing nature and infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
