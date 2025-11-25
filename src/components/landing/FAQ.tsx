import React from 'react';
import Badge from './Badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'What is the GMC Token?',
      answer:
        'The GMC Token is a digital asset designed to provide fair compensation and equitable participation for landowners affected by the development of the Gelephu Mindfulness City. It represents a stake in the future prosperity of the city.',
    },
    {
      question: 'How is land valuation determined?',
      answer:
        'We are developing a balanced and adaptive valuation system that goes beyond traditional benchmarks like PAVA rates. Our model aims to capture the true potential and future worth of land within GMC, linked to development indicators such as infrastructure progress and socio-economic metrics.',
    },
    {
      question: 'Who can participate in the token economy?',
      answer:
        'The primary beneficiaries are landowners whose properties are being acquired. Additionally, Bhutanese citizens will be able to hold or trade these tokens as part of the emerging GMC token economy, fostering shared prosperity.',
    },
    {
      question: 'Is there a legal framework for this?',
      answer:
        'Yes, the project adopts a dual-track approach. We are conducting stakeholder consultations and legal reviews to design a robust governance framework alongside the technical prototype to ensure transparency and legitimacy.',
    },
    {
      question: 'How can I trade or use my tokens?',
      answer:
        'A digital platform is being developed for token issuance, valuation, and trading. This interface will allow citizens to manage their assets and participate in the market, backed by a secure and transparent infrastructure.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="px-4 py-1">
            Common Questions
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Understanding the tokenization model and its impact on the community.
          </p>
        </div>

        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
