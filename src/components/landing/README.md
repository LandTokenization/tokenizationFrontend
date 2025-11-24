# Landing Page Component Structure

This directory contains all the modular components for the new Gelephu Mindfulness City landing page.

## Component Hierarchy

```
Landing Page (src/pages/Home.tsx)
├── SiteHeader
│   └── MobileMenu
├── Hero
│   └── Button
├── About
│   └── Badge
├── FAQ
│   ├── Badge
│   └── Accordion
│       ├── AccordionItem
│       ├── AccordionTrigger
│       └── AccordionContent
├── Team
│   ├── Card
│   ├── CardContent
│   ├── Badge
│   └── Social Icons
└── SiteFooter
```

## Component Files

- **Button.tsx** - Reusable button component with variants (default, outline, ghost) and sizes (default, lg, icon)
- **Badge.tsx** - Badge component for labels and tags with variants
- **Card.tsx** - Card container component with CardContent subcomponent
- **Accordion.tsx** - Accordion component system for FAQ section
- **MobileMenu.tsx** - Mobile navigation menu with slide-out animation
- **SiteHeader.tsx** - Main header/navbar component
- **Hero.tsx** - Hero section with call-to-action buttons
- **About.tsx** - About/Mission section with text and visuals
- **FAQ.tsx** - FAQ section using Accordion component
- **Team.tsx** - Team members grid with profiles
- **SiteFooter.tsx** - Footer with links and social media
- **utils.ts** - Utility functions (cn for className merging)
- **index.ts** - Barrel export file for easy imports

## Styling

- Uses **Tailwind CSS** for all styling
- Custom animations defined in `src/pages/Home.css`
- Responsive design with mobile-first approach
- Smooth transitions and hover effects throughout

## Previous Files

Old files have been backed up in `src/pages/backup/` for reference:
- `Home.old.tsx` - Previous hero-only landing page
- `Home.old.css` - Previous custom CSS

## Color Scheme

The design uses Tailwind's default color tokens:
- Primary colors for CTAs and highlights
- Secondary colors for badges
- Muted colors for subtle text
- Background/foreground for main text

## Accessibility

- Keyboard navigation support
- Focus visible states on all interactive elements
- Semantic HTML structure
- ARIA labels where needed
