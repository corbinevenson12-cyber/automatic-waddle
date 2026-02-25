import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-900/70">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/projects" className="text-xl font-bold text-blue-400">PhotoPath</Link>
            <nav className="space-x-4 text-sm text-slate-300">
              <Link href="/projects">Projects</Link>
              <Link href="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
