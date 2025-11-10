import '@/app/ui/global.css';
import { roboto } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official next.js course dashboard application built with app router by Jay',
  metadataBase: new URL('https://jay-nextjs-project.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`{roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
