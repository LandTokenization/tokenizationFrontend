import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Linkedin, Twitter, Github, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './Card';
import Badge from './Badge';
import Button from './Button';

const Team: React.FC = () => {
  const team = [
    {
      name: 'Jigme Wangchuck',
      role: 'Project Lead & Policy Strategist',
      bio: 'Leading the strategic vision for GMC\'s tokenization initiative. With over 15 years of experience in urban planning and policy development, Jigme ensures that the project aligns with national happiness goals while embracing modern economic frameworks.',
    },
    {
      name: 'Sonam Dema',
      role: 'Lead Economist',
      bio: 'Specializing in development economics and digital assets. Sonam designs the economic models that ensure fair valuation and sustainable growth for the token ecosystem, focusing on long-term value preservation for landowners.',
    },
    {
      name: 'Tashi Dorji',
      role: 'Technical Architect',
      bio: 'Blockchain expert and systems architect. Tashi oversees the technical implementation of the tokenization platform, ensuring security, scalability, and transparency in every transaction recorded on the ledger.',
    },
    {
      name: 'Karma Lhamo',
      role: 'Legal & Governance Advisor',
      bio: 'Expert in property law and digital governance. Karma navigates the complex regulatory landscape to create a robust legal framework that protects the rights of all participants in the GMC ecosystem.',
    },
    {
      name: 'Pema Tenzin',
      role: 'Community Liaison',
      bio: 'Dedicated to community engagement and social welfare. Pema acts as the bridge between the technical team and the landowners, ensuring that the community\'s voice is heard and their needs are met throughout the transition.',
    },
    {
      name: 'Dechen Wangmo',
      role: 'UX/UI Designer',
      bio: 'Crafting intuitive and accessible digital experiences. Dechen focuses on making the token platform user-friendly for citizens of all ages and technical backgrounds, prioritizing clarity and ease of use.',
    },
  ];

  return (
    <section id="team" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="px-4 py-1">
            Our People
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet the Visionaries</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A multidisciplinary team dedicated to building a fair and sustainable future for
            Gelephu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-2/5 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center min-h-[200px]">
                  <Users className="h-20 w-20 text-primary/40" />
                </div>
                <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium text-sm">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{member.bio}</p>
                  <div className="flex gap-4 mt-auto">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/team">
            <Button size="lg" className="cursor-pointer">
              View Full Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Team;
