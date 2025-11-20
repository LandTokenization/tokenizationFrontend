# Quick Reference: Using the New UX Components

## Toast Notifications

```typescript
import { useToast } from '@/context/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  return (
    <button onClick={() => showSuccess("Action completed!")}>
      Click me
    </button>
  );
}
```

## Navigation with Smooth Transitions

```typescript
import { useNavigation } from '@/lib/hooks';

function MyComponent() {
  const { navigateTo, navigateToDashboard, navigateToLogin } = useNavigation();

  return (
    <>
      <button onClick={() => navigateTo('/dashboard', 300)}>
        Go to Dashboard (300ms delay)
      </button>
      <button onClick={navigateToDashboard}>
        Quick Dashboard
      </button>
    </>
  );
}
```

## Enhanced Buttons with Loading State

```typescript
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await someAsyncOperation();
    setLoading(false);
  };

  return (
    <Button isLoading={loading} onClick={handleClick}>
      {loading ? 'Processing...' : 'Click me'}
    </Button>
  );
}
```

## Form Validation Example

```typescript
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { showError, showSuccess } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      showError('Invalid email format');
      return;
    }

    showSuccess('Email valid!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p className="text-destructive">{emailError}</p>}
    </form>
  );
}
```

## Action with Loading State

```typescript
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

function ActionButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleAction = async () => {
    setIsLoading(true);
    try {
      // Do something async
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Action completed!');
    } catch (error) {
      showError('Action failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button isLoading={isLoading} onClick={handleAction}>
      Perform Action
    </Button>
  );
}
```

## Button Variants

```typescript
import { Button } from '@/components/ui/button';

export default function ButtonShowcase() {
  return (
    <div className="space-y-4">
      {/* Primary button */}
      <Button>Primary Action</Button>

      {/* Secondary button */}
      <Button variant="outline">Secondary Action</Button>

      {/* Ghost button */}
      <Button variant="ghost">Tertiary Action</Button>

      {/* Destructive button */}
      <Button variant="destructive">Delete</Button>

      {/* Loading state */}
      <Button isLoading>Processing...</Button>

      {/* Disabled state */}
      <Button disabled>Disabled</Button>

      {/* Size variants */}
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>

      {/* Icon button */}
      <Button size="icon">+</Button>
    </div>
  );
}
```

## Key Animation Classes

```css
/* Use these in your components */
.animate-spin /* Loading spinner */
.fade-in-up /* Page entrance */
.transition-all /* Smooth transitions */
.hover:shadow-md /* Enhanced hover */
.active:scale-95 /* Button press effect */
```

## Accessibility Features

- ✅ All buttons have proper focus states (ring-2)
- ✅ Forms validate in real-time with error messages
- ✅ Loading states prevent multiple submissions
- ✅ Toast notifications use semantic HTML
- ✅ Reduced motion respected via CSS media query
- ✅ Color contrast meets WCAG standards

## Common Patterns

### Pattern 1: Async Action with Feedback
```typescript
const handleAction = async () => {
  setLoading(true);
  showInfo('Processing...');
  await action();
  showSuccess('Done!');
  setLoading(false);
};
```

### Pattern 2: Form Submission
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) {
    showError('Validation failed');
    return;
  }
  handleAction();
};
```

### Pattern 3: Navigation with Feedback
```typescript
const handleNavigate = async () => {
  setLoading(true);
  showInfo('Loading page...');
  navigateTo('/path');
  setLoading(false);
};
```

---

**All components are TypeScript-ready and fully typed!**
