import type { Metadata } from 'next';
import { Oswald, Roboto_Mono } from 'next/font/google';
import './globals.css';

const oswald = Oswald({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Basketball Overlay Pro',
  description: 'Professional Broadcast Quality Basketball Overlay',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${robotoMono.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
