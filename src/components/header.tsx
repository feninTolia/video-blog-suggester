'use client';

import Link from 'next/link';

interface HeaderProps {
  user: { name: string; image?: string | null } | null;
  isAuthLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function Header({
  user,
  isAuthLoading,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Video Blog Suggester home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
              <path d="m9 8.5 5 2.5-5 2.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            Video Blog Suggester
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:block">
                {user.name}
              </span>
              <img
                src={user.image ?? ''}
                alt={user.name}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
              />
              <button
                onClick={onSignOut}
                disabled={isAuthLoading}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAuthLoading ? 'Signing out...' : 'Sign out'}
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              disabled={isAuthLoading}
              className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAuthLoading ? 'Signing in...' : 'Sign in'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
