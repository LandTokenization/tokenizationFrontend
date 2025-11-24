import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Card, CardContent } from '../components/landing/Card';
import Badge from '../components/landing/Badge';

// Import all WhatsApp images
import img1 from '../assets/WhatsApp Image 2025-11-16 at 17.28.31_1203b85a.jpg';
import img2 from '../assets/WhatsApp Image 2025-11-16 at 17.29.10_5ed7aced.jpg';
import img3 from '../assets/WhatsApp Image 2025-11-16 at 17.33.36_7ac96a2f.jpg';
import img4 from '../assets/WhatsApp Image 2025-11-16 at 17.36.16_53022e51.jpg';
import img5 from '../assets/WhatsApp Image 2025-11-16 at 17.38.31_3570e369.jpg';
import img6 from '../assets/WhatsApp Image 2025-11-16 at 18.34.27_c67dd515.jpg';
import img7 from '../assets/WhatsApp Image 2025-11-16 at 18.41.40_4534cac9.jpg';
import img8 from '../assets/WhatsApp Image 2025-11-16 at 18.58.00_e99cf6ca.jpg';
import img9 from '../assets/WhatsApp Image 2025-11-16 at 19.02.50_90ab6e6d.jpg';
import img10 from '../assets/WhatsApp Image 2025-11-16 at 19.11.39_1cadef38.jpg';
import img11 from '../assets/WhatsApp Image 2025-11-16 at 19.27.11_ea6d61ba.jpg';
import img12 from '../assets/WhatsApp Image 2025-11-16 at 19.30.51_e27ddf2e.jpg';
import img13 from '../assets/WhatsApp Image 2025-11-16 at 19.38.34_343b3f35.jpg';
import img14 from '../assets/WhatsApp Image 2025-11-16 at 23.06.03_6996aa42.jpg';

const teamMembers = [
  {
    name: 'Jigme Wangchuck',
    role: 'Project Lead & Policy Strategist',
    image: img1,
    bio: 'Leading the strategic vision for GMC\'s tokenization initiative. With over 15 years of experience in urban planning and policy development, Jigme ensures that the project aligns with national happiness goals while embracing modern economic frameworks.',
    department: 'Strategy',
  },
  {
    name: 'Sonam Dema',
    role: 'Lead Economist',
    image: img2,
    bio: 'Specializing in development economics and digital assets. Sonam designs the economic models that ensure fair valuation and sustainable growth for the token ecosystem, focusing on long-term value preservation for landowners.',
    department: 'Economics',
  },
  {
    name: 'Tashi Dorji',
    role: 'Technical Architect',
    image: img3,
    bio: 'Blockchain expert and systems architect. Tashi oversees the technical implementation of the tokenization platform, ensuring security, scalability, and transparency in every transaction recorded on the ledger.',
    department: 'Technology',
  },
  {
    name: 'Karma Lhamo',
    role: 'Legal & Governance Advisor',
    image: img4,
    bio: 'Expert in property law and digital governance. Karma navigates the complex regulatory landscape to create a robust legal framework that protects the rights of all participants in the GMC ecosystem.',
    department: 'Legal',
  },
  {
    name: 'Pema Tenzin',
    role: 'Community Liaison',
    image: img5,
    bio: 'Dedicated to community engagement and social welfare. Pema acts as the bridge between the technical team and the landowners, ensuring that the community\'s voice is heard and their needs are met throughout the transition.',
    department: 'Community',
  },
  {
    name: 'Dechen Wangmo',
    role: 'UX/UI Designer',
    image: img6,
    bio: 'Crafting intuitive and accessible digital experiences. Dechen focuses on making the token platform user-friendly for citizens of all ages and technical backgrounds, prioritizing clarity and ease of use.',
    department: 'Design',
  },
  {
    name: 'Dorji Tshering',
    role: 'Data Analytics Lead',
    image: img7,
    bio: 'Specializing in business intelligence and data-driven insights. Dorji leverages analytics to track token performance and inform strategic decisions that benefit the entire GMC community.',
    department: 'Analytics',
  },
  {
    name: 'Yeshi Yangzom',
    role: 'Community Outreach Coordinator',
    image: img8,
    bio: 'Passionate about stakeholder engagement and cultural integration. Yeshi ensures that the tokenization initiative respects local traditions while driving meaningful development opportunities.',
    department: 'Outreach',
  },
  {
    name: 'Kinley Tenzin',
    role: 'Smart Contract Developer',
    image: img9,
    bio: 'Expert in blockchain technology and decentralized systems. Kinley develops and audits smart contracts to ensure secure and transparent token operations.',
    department: 'Development',
  },
  {
    name: 'Yangkyi Dema',
    role: 'Sustainability Officer',
    image: img10,
    bio: 'Committed to ensuring that GMC development aligns with environmental and social sustainability standards. Yangkyi monitors the project\'s impact on local ecosystems.',
    department: 'Sustainability',
  },
  {
    name: 'Tenzin Norbu',
    role: 'Risk Management Specialist',
    image: img11,
    bio: 'Identifying and mitigating potential risks in the tokenization model. Tenzin works to protect stakeholders and ensure project resilience in changing conditions.',
    department: 'Risk',
  },
  {
    name: 'Pemako Yangzom',
    role: 'Knowledge Management Officer',
    image: img12,
    bio: 'Managing documentation and institutional knowledge. Pemako ensures that all project insights, lessons learned, and best practices are captured for future reference.',
    department: 'Operations',
  },
  {
    name: 'Rigzin Wangdi',
    role: 'Financial Controller',
    image: img13,
    bio: 'Overseeing financial planning and resource allocation for the GMC initiative. Rigzin ensures fiscal responsibility and optimal use of project funds.',
    department: 'Finance',
  },
  {
    name: 'Chimi Dolma',
    role: 'Stakeholder Relations Manager',
    image: img14,
    bio: 'Facilitating relationships between the project team, government agencies, and community representatives. Chimi fosters collaboration and mutual understanding across all parties.',
    department: 'Relations',
  },
];

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="py-16 md:py-24 border-b border-border/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="secondary" className="px-4 py-1">
                Our People
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Meet the Visionaries Behind GMC Tokenization
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A multidisciplinary team of 14 dedicated professionals building a fair, sustainable, and innovative future for Gelephu.
              </p>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="w-full aspect-square overflow-hidden bg-muted">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                        <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TeamPage;
