import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Study Buddy',
  description: 'Your AI-powered learning companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
