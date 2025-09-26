# Gravatar Integration Usage

This document shows how to use the newly added Gravatar support in your consultant CV management system.

## Basic Usage

```tsx
import { GravatarAvatar } from '@/components/ui/gravatar-avatar';

// With email - automatically generates Gravatar
<GravatarAvatar
  email="john.doe@example.com"
  firstName="John"
  lastName="Doe"
  size={48}
/>

// With custom avatar URL (fallback to Gravatar if fails)
<GravatarAvatar
  email="john.doe@example.com"
  firstName="John"
  lastName="Doe"
  avatar="/uploads/john-avatar.jpg"
  size={64}
/>

// Just email (fallback to first letter of email)
<GravatarAvatar
  email="john.doe@example.com"
  size={32}
/>
```

## Gravatar Options

```tsx
import { GravatarAvatar } from '@/components/ui/gravatar-avatar';

<GravatarAvatar
  email="john.doe@example.com"
  firstName="John"
  lastName="Doe"
  size={80}
  gravatarOptions={{
    defaultImage: 'identicon', // Generate geometric pattern if no Gravatar
    rating: 'pg',              // Content rating
    forceDefault: false        // Set true to always show default image
  }}
/>
```

## Integration with Consultant Data

```tsx
import { GravatarAvatar } from '@/components/ui/gravatar-avatar';
import { Consultant } from '@/types';

interface ConsultantCardProps {
  consultant: Consultant;
}

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <div className="flex items-center space-x-3">
      <GravatarAvatar
        email={consultant.email}
        firstName={consultant.firstName}
        lastName={consultant.lastName}
        avatar={consultant.avatar}
        size={48}
        className="border-2 border-gray-200"
      />
      <div>
        <h3>{consultant.firstName} {consultant.lastName}</h3>
        <p>{consultant.title}</p>
      </div>
    </div>
  );
}
```

## Available Gravatar Default Images

- `mp` - Mystery Person (default)
- `identicon` - Geometric pattern based on email hash
- `monsterid` - Monster-style avatar
- `wavatar` - Retro-style faces
- `retro` - 8-bit arcade-style pixelated faces
- `robohash` - Robot-style avatars
- `blank` - Transparent PNG

## Features

✅ **Automatic Fallback Chain**: Custom avatar → Gravatar → Initials
✅ **Type Safe**: Full TypeScript support
✅ **Responsive**: Configurable sizes for different contexts
✅ **Accessible**: Proper alt text and ARIA support
✅ **Error Handling**: Graceful fallback when images fail to load
✅ **Performance**: Efficient image loading and caching