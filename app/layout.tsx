import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SILENT.BIO — Your identity. Your space. Your rules.',
  description: 'Create a profile that actually feels like you. Completely free, open, and privacy-first.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
