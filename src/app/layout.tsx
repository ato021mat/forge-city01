import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Forge City – کاراکتر تو، دنیای تو',
  description: 'کاراکتر بساز، در شهر زندگی کن، شغل واقعی انجام بده.',
};
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#0ea5e9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased select-none">{children}</body>
    </html>
  );
}
