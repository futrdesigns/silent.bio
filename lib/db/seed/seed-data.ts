/**
 * SILENT.BIO — Comprehensive Badge Seed Data
 * Badges inspired by alias.rip, fakecrime.bio, and guns.lol
 * (developer, booster, og, hacker/terminal, skull, crown, staff, verified, bug hunter, donor, vip, etc.)
 */

export interface SystemBadge {
  id: string;
  name: string;
  description: string;
  iconSvg: string;
  badgeType: 'system' | 'earned' | 'award' | 'community' | 'rare';
  color?: string;
}

export const SYSTEM_BADGES: SystemBadge[] = [
  {
    id: 'verified',
    name: 'Verified',
    description: 'Authentic identity verified on SILENT.BIO',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    badgeType: 'system',
    color: '#A5A5FF',
  },
  {
    id: 'early_adopter',
    name: 'OG / Early Adopter',
    description: 'Joined in the founding epoch of SILENT.BIO',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    badgeType: 'earned',
    color: '#FBBF24',
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Official SILENT.BIO core team member',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    badgeType: 'system',
    color: '#60A5FA',
  },
  {
    id: 'crown_vip',
    name: 'VIP Monarch',
    description: 'Royalty tier profile status',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z"/></svg>',
    badgeType: 'award',
    color: '#F59E0B',
  },
  {
    id: 'terminal_coder',
    name: 'Kernel / Dev',
    description: 'Code craftsman and systems builder',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    badgeType: 'earned',
    color: '#4EFE59',
  },
  {
    id: 'skull_syndicate',
    name: 'Phantom / Syndicate',
    description: 'Underground digital syndicate member',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 3.5 2 6.5 5 7.6V20h6v-2.4c3-1.1 5-4.1 5-7.6a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/></svg>',
    badgeType: 'rare',
    color: '#E06D6D',
  },
  {
    id: 'booster',
    name: 'Nitro Booster',
    description: 'Profile booster and active server supporter',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    badgeType: 'award',
    color: '#EC4899',
  },
  {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    description: 'Identified and reported system vulnerabilities',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>',
    badgeType: 'earned',
    color: '#10B981',
  },
  {
    id: 'craft_master',
    name: 'Theme Artisan',
    description: 'Designer of high-craft community themes',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>',
    badgeType: 'community',
    color: '#8B5CF6',
  },
  {
    id: 'audio_virtuoso',
    name: 'Audiophile',
    description: 'Curator of sonic profile soundscapes',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    badgeType: 'community',
    color: '#06B6D4',
  },
  {
    id: 'supporter',
    name: 'Open Supporter',
    description: 'Ecosystem patron and open-web defender',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    badgeType: 'community',
    color: '#F43F5E',
  },
  {
    id: 'crypto_key',
    name: 'PGP Signed',
    description: 'Cryptographically authenticated identity',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5-4 4 1.5 1.5L8 15l-1.5-1.5L2 18v4h4l4.5-4.5L9 16l2-2 1.5 1.5 4-4L15 10l1.5-1.5 2 2 2.5-2.5Z"/></svg>',
    badgeType: 'rare',
    color: '#EAB308',
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Most active between 02:00 and 06:00 UTC',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    badgeType: 'earned',
    color: '#93C5FD',
  },
  {
    id: 'flame',
    name: 'Trending',
    description: 'Profile views surged over 500% this week',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    badgeType: 'earned',
    color: '#F97316',
  },
];

export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'support', 'help', 'api', 'auth', 'login',
  'register', 'dashboard', 'settings', 'profile', 'editor', 'explore', 'themes',
  'features', 'faq', 'blog', 'status', 'terms', 'privacy', 'security', 'billing',
  'silent', 'silentbio', 'staff', 'mod', 'moderator', 'system', 'null', 'undefined'
];
