import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const sora = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Vinícius Pereira',
  description: 'Portfolio em formato de chatbot (:'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.className} antialiased grainy-bg bg-neutral-300`}
      >
        {children}
      </body>
    </html>
  );
}
