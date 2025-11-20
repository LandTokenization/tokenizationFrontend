import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './utils';

interface AccordionProps {
  children: React.ReactNode;
  defaultValue?: string | null;
}

const Accordion: React.FC<AccordionProps> = ({ children, defaultValue }) => {
  const [openItem, setOpenItem] = useState<string | null>(defaultValue || null);

  return (
    <div className="w-full">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { openItem, setOpenItem } as any) : child
      )}
    </div>
  );
};

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  openItem?: string | null;
  setOpenItem?: (value: string | null) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, openItem, setOpenItem }) => {
  const isOpen = openItem === value;

  return (
    <div className="border-b last:border-b-0">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, isOpen, setOpenItem } as any)
          : child
      )}
    </div>
  );
};

interface AccordionTriggerProps {
  children: React.ReactNode;
  value?: string;
  isOpen?: boolean;
  setOpenItem?: (value: string | null) => void;
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  value,
  isOpen,
  setOpenItem,
}) => (
  <button
    className="flex flex-1 w-full items-start justify-between gap-4 py-4 text-left text-lg font-medium transition-all hover:underline"
    onClick={() => {
      if (setOpenItem && value) {
        setOpenItem(isOpen ? null : value);
      }
    }}
  >
    {children}
    <ChevronDown
      className={cn(
        'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
        isOpen && 'rotate-180'
      )}
    />
  </button>
);

interface AccordionContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children, isOpen }) => (
  <div className={cn('overflow-hidden transition-all', isOpen ? 'animate-accordion-down' : 'hidden')}>
    <div className="pb-4 text-muted-foreground">{children}</div>
  </div>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
