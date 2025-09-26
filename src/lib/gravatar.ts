import { createHash } from 'crypto';

export interface GravatarOptions {
  size?: number;
  defaultImage?: 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'blank' | string;
  rating?: 'g' | 'pg' | 'r' | 'x';
  forceDefault?: boolean;
}

export function generateGravatarUrl(email: string, options: GravatarOptions = {}): string {
  const {
    size = 80,
    defaultImage = 'mp',
    rating = 'g',
    forceDefault = false
  } = options;

  if (!email) {
    return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultImage}&r=${rating}`;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hash = createHash('md5').update(normalizedEmail).digest('hex');

  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: rating,
  });

  if (forceDefault) {
    params.set('f', 'y');
  }

  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}` || '?';
}

export function generateAvatarFallback(firstName?: string, lastName?: string, email?: string): string {
  if (firstName || lastName) {
    return getInitials(firstName, lastName);
  }

  if (email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() || '?';
  }

  return '?';
}