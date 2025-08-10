import './globals.css';
import { ReactNode } from 'react';
import { SessionWrapper } from './components/SessionWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
