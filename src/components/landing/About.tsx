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
            About <span className="text-primary">Pelsub Initiative</span>
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            {/* <p>
              The Gelephu Mindfulness City (GMC) represents a visionary leap forward,
              integrating mindful, sustainable, and inclusive development principles.
            </p>
            <p>
              Tokenization has emerged as a novel mechanism to ensure fair compensation
              and equitable participation of landowners affected by land acquisition. This
              idea reflects an aspiration to merge technology with social well-being and
              shared prosperity.
            </p> */}
            <p>
              We are a Pelsung team under Innovate for GMC - Cohort 1, working on a policy and systems blueprint of recommendations that explores how the Royal Vision of Gelephu Mindfulness City could be operationalized in practice.
            </p>
            <p>
              Our project proposes a transparent land tokenization framework that enables long-term partnership for landowners while creating pathways for broader national participation in GMC's economic growth.
            </p>
            <p className="font-medium text-foreground">
              Alongside this, we present a non-monetary Token of Appreciation to honour selfless contributions by Bhutanese citizens and institutions engaged in nation-building. Through this blueprint, we present a conceptual model integrating valuation, digital systems, governance, and civic recognition as part of a youth-led innovation exercise.
            </p>
            <p className="text-sm text-muted-foreground italic">
              This platform reflects our independent recommendations and learning under the Innovate for GMC program and does not represent official GMC policy or implementation.
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
