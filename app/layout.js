import './globals.css';

export const metadata = {
  title: 'Digital Life Lessons - Share & Preserve Personal Wisdom',
  description: 'A premium platform to record, discover, and learn from life lessons, personal insights, and collective community wisdom.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
