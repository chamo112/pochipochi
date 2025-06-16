import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pochipochi',
  description: '家計簿アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
