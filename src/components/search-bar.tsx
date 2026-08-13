'use client';

import { useState } from 'react';

interface SearchBarProps {
  isSignedIn: boolean;
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSignIn: () => void;
}

export function SearchBar({
  isSignedIn,
  isSearching,
  onSearch,
  onSignIn,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed && isSignedIn && !isSearching) {
      onSearch(trimmed);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl border border-border bg-card py-1.5 pl-4 pr-1.5 shadow-sm transition-colors focus-within:border-ring"
      >
        <svg
          className="h-4 w-4 shrink-0 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a topic to learn..."
          disabled={!isSignedIn || isSearching}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[15px] text-foreground placeholder:text-muted outline-none disabled:cursor-not-allowed disabled:text-muted"
        />
        <button
          type="submit"
          disabled={!isSignedIn || isSearching}
          className="shrink-0 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {!isSignedIn && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You need to sign in to search.
          </p>
          <button
            onClick={onSignIn}
            className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-80"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
