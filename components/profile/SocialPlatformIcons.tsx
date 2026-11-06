import * as React from 'react';

export function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.28 8.28 0 0 0 4.83 1.55v-3.4a4.85 4.85 0 0 1-1.06-.18z" />
    </svg>
  );
}

export function KickIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h5v5h3V5h3V3h7v6h-3v3h-3v2h3v3h3v6h-7v-2h-3v-3h-3v5H3V3z" />
    </svg>
  );
}

export function SteamIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-10 9.78l5.63 2.32a3 3 0 0 1 2.83-.87l2.84-4.1a3 3 0 1 1 4.19 3.66l-4.12 2.82a3 3 0 0 1-1.39 3.25l-2.4 5.82A10 10 0 1 0 12 2zm3.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6.2 8.7a1.8 1.8 0 1 0-1.8 1.8 1.8 1.8 0 0 0 1.8-1.8z" />
    </svg>
  );
}

export function TelegramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.675c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.416z" />
    </svg>
  );
}
