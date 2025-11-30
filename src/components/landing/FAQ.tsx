import React, { useState, useMemo } from 'react';
import Badge from './Badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
import { Search } from 'lucide-react';

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqs = [
    {
      category: 'Basics',
      question: 'What is Land Tokenization in GMC?',
      answer:
        'Land tokenization refers to the process of representing the value of land in the form of digital tokens within the GMC framework. Instead of compensation being limited to a one-time settlement, this model envisions landowners receiving digital tokens that allow them to remain connected to GMC\'s long-term economic growth. These tokens represent a continuing stake in the City\'s future and are designed to let landowners benefit as GMC grows over time.',
    },
    {
      category: 'Basics',
      question: 'How is this different from traditional land compensation?',
      answer:
        'Under traditional compensation systems, landowners typically receive a fixed, one-time settlement either as cash compensation or land substitute, after which they no longer share in any future increase in land value created by development from the acquired land. The tokenized model envisioned for GMC introduces a growth-linked approach, where landowners will continue to benefit from the City\'s economic progress through the tokens they hold. This shifts compensation from a one-time settlement to a long-term partnership in development.',
    },
    {
      category: 'Vision',
      question: 'What is the broader purpose and vision behind tokenization?',
      answer:
        'At its heart, tokenization is envisioned as a nation-building tool, not just a compensation method. It is aligned with His Majesty\'s vision for a future-ready Bhutan through GMC, where development is inclusive, mindful, and shared. While it supports long-term security for landowners, its purpose extends far beyond compensation, circulating prosperity across generations, strengthening national participation in growth, and creating new opportunities for Bhutanese youth in emerging sectors such as digital finance, technology, governance, and urban systems. It reflects a development model where economic progress, spiritual values, and people\'s well-being advance together, ensuring that GMC\'s success benefits not just a few but the nation as a whole, today and into the future.',
    },
    {
      category: 'How It Works',
      question: 'How is land tokenization expected to work in practice?',
      answer:
        'In practice, land would first be valued, after which landowners would be issued digital tokens reflecting that value as a stake in GMC\'s future growth. These tokens would be securely recorded within a digital system and represent an ongoing economic interest in the GMC\'s development. Depending on individual needs, landowners could choose to hold the tokens for the long term, pass them on to family members, or trade them through regulated platforms. As GMC grows through infrastructure, investment, and economic activity, the value and benefits linked to these tokens are expected to grow over time, allowing landowners to share in GMC\'s long-term prosperity in a structured and secure manner.',
    },
    {
      category: 'Benefits',
      question: 'What are the key benefits of the tokenized model for landowners?',
      answer:
        'The tokenized model is designed to offer long-term participation instead of one-time settlement. It allows landowners to remain connected to GMC\'s growth, preserve value across generations, and enjoy greater flexibility in how they manage their holdings. As the City develops, the value linked to these tokens is expected to grow alongside it, helping transform compensation into a lasting economic partnership.',
    },
    {
      category: 'Inheritance & Transfer',
      question: 'Can land tokens be inherited or passed on to family members?',
      answer:
        'Yes. Land tokens are expected to be inheritable, allowing families to pass on benefits to future generations. Transfers would be managed through verified legal and digital records to ensure that inheritance remains clear, secure, and protected.',
    },
    {
      category: 'Security',
      question: 'How is the safety of token ownership ensured in the system?',
      answer:
        'Token ownership is proposed to be protected through secure digital technologies that create a permanent and tamper-proof record of transactions. Automatic digital rules would ensure that tokens are moved only in approved and verified ways. Together, these safeguards are intended to make the system transparent, reliable, and trustworthy.',
    },
    {
      category: 'Trading & Liquidity',
      question: 'Would landowners be able to convert their tokens into cash when needed?',
      answer:
        'Under the proposed framework, landowners would be able to convert their tokens into cash in a manner similar to selling shares, through approved and regulated platforms. This would give them the flexibility to either hold tokens for long-term growth or sell a portion when funds are required, depending on individual needs and prevailing market conditions.',
    },
    {
      category: 'Financial Features',
      question: 'Can land tokens be used as collateral for loans?',
      answer:
        'The project proposes that this possibility may be explored in the future, subject to regulatory approval. If permitted, land tokens could be used with approved financial institutions to help token holders access credit in a safe and regulated way.',
    },
    {
      category: 'Returns',
      question: 'When might token owners begin to see returns?',
      answer:
        'Returns are expected to emerge as GMC\'s development gains momentum and real economic activity takes shape. With the phased rollout of infrastructure, investments, and businesses, token owners may begin to see benefits as growth naturally unfolds. In this way, returns are designed to grow hand in hand with the GMC\'s progress, reflecting steady and sustainable value creation over time.',
    },
    {
      category: 'Token of Appreciation',
      question: 'What is the Token of Appreciation, and how is it different from land tokens?',
      answer:
        'The Token of Appreciation is proposed as a symbol of national honour and civic recognition, reflecting a person\'s selfless contribution to GMC and nation-building. It is not linked to land, compensation, or investment value, and is completely different from land tokens. It is intended purely as a symbol of service, gratitude, and national recognition for contributors such as volunteers, professionals, youth, institutions, and Bhutanese living abroad.',
    },
    {
      category: 'Token of Appreciation',
      question: 'Does the Token of Appreciation have any financial value or cash benefits?',
      answer:
        'No. The Token of Appreciation has no monetary value, cannot be sold, traded, or used for financial purposes. Its value lies only in honour, public recognition, and civic acknowledgement. It is proposed to be reflected through digital recognition, and its incentives through acknowledgement, access, privilege, opportunity, and trust rather than cash.',
    },
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory, faqs]);

  return (
    <section id="faq" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="px-4 py-1">
            Common Questions
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            The following responses present perspectives and recommendations developed under the Innovate for GMC initiative as part of a conceptual policy and prototype system, and do not represent official GMC policy or implementation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && ` (${faqs.filter(f => f.category === category).length})`}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredFaqs.length} of {faqs.length} questions
        </div>

        {/* Accordion with scroll container */}
        <div className="max-h-[600px] overflow-y-auto pr-4 space-y-2 rounded-lg border border-border/50 p-4 bg-background/50">
          <Accordion>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <span className="text-left hover:text-primary transition-colors">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No questions found. Try adjusting your search or filters.
              </div>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
