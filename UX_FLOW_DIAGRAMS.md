# User Experience Flow Diagrams

## 1. Landing Page Flow

```
┌──────────────────────────────────────┐
│   Land on Homepage                   │
│   (Fade-in-up animation 0.4s)       │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
  ┌──────────┐   ┌──────────┐
  │Explore   │   │Whitepaper│
  │Framework │   │Button    │
  └────┬─────┘   └────┬─────┘
       │              │
       ▼              ▼
  ┌──────────┐   ┌──────────┐
  │Loading   │   │Loading   │
  │Toast     │   │Toast     │
  │"Loading  │   │"Opening  │
  │framework"│   │whitepaper│
  └────┬─────┘   └────┬─────┘
       │              │
   ┌───┴──────┐   ┌───┴────────────┐
   │After 800 │   │After 500ms     │
   │ms delay  │   │Open new window │
   └────┬─────┘   └────────────────┘
        │
        ▼
   ┌──────────────┐
   │Smooth        │
   │Navigation    │
   │to Dashboard  │
   │(300ms delay) │
   └──────────────┘
```

## 2. Authentication Flow

```
┌─────────────────────────┐
│ Click Login Button       │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Enter Email & Password  │
│ - Real-time validation  │
│ - Error messages        │
└──────────┬──────────────┘
           │
           ▼
    ┌──────────────┐
    │Form Valid?   │
    └──┬──────┬───┘
       │      │
      NO     YES
       │      │
       ▼      ▼
    ┌──┐  ┌──────────────────┐
    │X │  │Show Loading State │
    │  │  │(spinner + toast)  │
    └──┘  └────────┬──────────┘
       │           │
       │      ┌────┴─────┐
       │      │After 1.5s│
       │      └────┬─────┘
       │           │
       ▼           ▼
    ┌─────┐   ┌──────────┐
    │Error│   │Success   │
    │Toast│   │Toast     │
    └─────┘   └────┬─────┘
               ┌───┴──────┐
               │After 500 │
               │ms: Nav to│
               │Dashboard │
               └──────────┘
```

## 3. Dashboard Action Flow

```
┌──────────────────────────────┐
│ Dashboard Loaded             │
│ - Metric cards visible       │
│ - Quick action buttons show  │
└──────────┬───────────────────┘
           │
    ┌──────┴──────┬────────────┐
    │             │            │
    ▼             ▼            ▼
┌────────┐  ┌─────────┐  ┌──────────┐
│Buy     │  │Transfer │  │View      │
│Tokens  │  │Button   │  │Details   │
└────┬───┘  └────┬────┘  └────┬─────┘
     │           │            │
     ▼           ▼            ▼
  ┌──────────────────────────────┐
  │Button clicked:               │
  │- Disable button              │
  │- Show spinner                │
  │- Show info toast             │
  └────────────┬─────────────────┘
               │
        ┌──────┴──────┐
        │Simulate 1-2 │
        │second delay │
        └──────┬──────┘
               │
               ▼
      ┌────────────────┐
      │Show success    │
      │toast + action  │
      │complete message│
      └─────────────────┘
```

## 4. Form Validation Flow

```
┌─────────────────────┐
│ User types email    │
└────────┬────────────┘
         │
         ▼
    ┌─────────────────────────┐
    │ Real-time Validation    │
    │ - Check format          │
    │ - Clear previous error  │
    └────┬────────────────────┘
         │
     ┌───┴──────┐
     │          │
   VALID      INVALID
     │          │
     ▼          ▼
  No error   Show error
  message    message
     │          │
     │     ┌────┴────┐
     │     │Red text │
     │     │below    │
     │     │field    │
     └─────┴────┬────┘
              │
        Form submission
        allowed only if
        ALL fields valid
```

## 5. Navigation Flow with Feedback

```
┌──────────────────────┐
│ User Clicks Link     │
│ (Sidebar nav item)   │
└────────┬─────────────┘
         │
         ▼
    ┌─────────────────┐
    │Link Styling:    │
    │- Instant visual │
    │  change (active)│
    │- Shadow effect  │
    │- Color change   │
    └────────┬────────┘
             │
             ▼
      ┌──────────────┐
      │300ms delay   │
      │before nav    │
      └────┬─────────┘
           │
           ▼
   ┌───────────────────┐
   │Page Transition:   │
   │- Fade out old     │
   │- Fade in new      │
   │- Duration: 0.4s   │
   └───────────────────┘
```

## 6. Loading State Progression

```
BUTTON STATES:
┌──────────────┐
│ Default      │  - Normal appearance
│ bg-primary   │  - Cursor pointer
│ text-white   │  - Shadow: none
└──────────────┘
       │
    Hover
       │
       ▼
┌──────────────┐
│ Hover        │  - Darker background
│ bg-primary/90│  - Shadow: 0 4px 6px
│ shadow-md    │  - Cursor pointer
└──────────────┘
       │
    Click
       │
       ▼
┌──────────────┐
│ Active       │  - Scale: 0.95
│ scale-95     │  - Shadow: reduced
│ duration-200 │  - Smooth transition
└──────────────┘
       │
   Async Op
       │
       ▼
┌──────────────┐
│ Loading      │  - Disabled: true
│ isLoading    │  - Spinner visible
│ opacity-70   │  - No click events
└──────────────┘
       │
  Complete
       │
       ▼
┌──────────────┐
│ Back to      │  - Return to default
│ Default      │  - Success toast
└──────────────┘
```

## 7. Toast Notification Lifecycle

```
ACTION TRIGGERED
       │
       ▼
┌─────────────────┐
│ Toast Created   │  Duration: 3-4 seconds
│ - ID generated  │  Animation: fade-in-up
│ - Message set   │  Position: bottom-right
│ - Type assigned │
└────────┬────────┘
         │
    ┌────┴──────────────────┐
    │ Auto-dismiss           │ User can close
    │ (if enabled)          │ with × button
    │                       │
    ├───────────────────────┤
    │ Fade-out animation    │
    │ Remove from DOM       │
    └───────────────────────┘
```

## 8. Sidebar Navigation States

```
NAVIGATION ITEM STATES:

┌─────────────────────┐
│ Inactive            │  - bg: none
│ text-slate-700      │  - hover: bg-slate-100
│ hover:bg-slate-100  │  - transition: 200ms
└─────────────────────┘
       │
    Click/Hover
       │
       ▼
┌─────────────────────┐
│ Active              │  - bg: bg-slate-900
│ bg-slate-900        │  - text: text-white
│ text-white          │  - shadow: shadow-sm
│ shadow-sm           │  - hover: shadow-md
└─────────────────────┘
```

## 9. Complete User Journey: "Buy Tokens"

```
START
  │
  ├─► User on Dashboard
  │   (page fades in)
  │
  ├─► User sees "Buy Tokens" button
  │   (with Plus icon)
  │
  └─► User hovers on button
      (shadow appears, text slightly darker)
      │
      └─► User clicks button
          ├─► Button shows loading spinner
          ├─► Button becomes disabled (no more clicks)
          ├─► Info toast: "Initializing token purchase..."
          │
          ├─► Wait 1200ms (simulated processing)
          │
          ├─► Loading spinner disappears
          ├─► Button re-enabled
          ├─► Success toast: "Buy tokens interface loaded!"
          │
          └─► User can click again or perform other action
              (or navigate away)
```

## 10. Error Recovery Flow

```
USER ENCOUNTERS ERROR
       │
       ▼
┌──────────────────────┐
│ Form Validation      │
│ Error detected       │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────┐
│Field   │  │Toast     │
│shows   │  │error msg │
│error   │  └──────────┘
│message │
└───┬────┘
    │
    ▼
USER CORRECTS INPUT
    │
    ▼
┌──────────────┐
│Error message │
│disappears    │
└──────────────┘
    │
    ▼
FORM RESUBMIT
    │
    └─► Success (or new error)
```

## Color-Coded Feedback

```
┌─────────────┬──────────────┬─────────────────────┐
│ Toast Type  │ Color        │ Use Case            │
├─────────────┼──────────────┼─────────────────────┤
│ Success     │ Green        │ Action completed    │
│ Error       │ Red          │ Something went wrong│
│ Warning     │ Amber        │ Attention needed    │
│ Info        │ Blue         │ FYI messages       │
└─────────────┴──────────────┴─────────────────────┘
```

---

## Key Interaction Principles

1. **Feedback Always Shown**: Every user action gets visible feedback
2. **Loading Prevented**: Disabled buttons prevent duplicate submissions
3. **Error Clear**: Validation errors explain what's wrong
4. **Smooth Transitions**: 200ms animations feel responsive
5. **Consistent Timing**: Standard delays (300ms nav, 1-2s async)
6. **Mobile Friendly**: All interactions work on touch devices
7. **Accessible**: Keyboard navigation supported throughout

---

## Performance Targets

- Page load: < 3 seconds
- Navigation: 300ms with visual feedback
- Form validation: < 50ms (real-time)
- Button interaction: < 200ms visual feedback
- Toast notification: < 100ms to appear
- Async operation: 1-2 seconds simulated

All animations use CSS (GPU accelerated) for smooth 60fps performance.
