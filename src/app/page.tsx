'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from '@/lib/auth/auth-client';
import { searchContentAction } from '@/app/actions/search';
import { Header } from '@/components/header';
import { ResultCard } from '@/components/result-card';
import { SearchBar } from '@/components/search-bar';

export default function Home() {
  const { data: session, isPending } = useSession();
  const [authLoading, setAuthLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Awaited<
    ReturnType<typeof searchContentAction>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user ?? null;

  function handleSignIn() {
    setAuthLoading(true);
    signIn.social({ provider: 'github' });
  }

  async function handleSignOut() {
    setAuthLoading(true);
    await signOut();
    setAuthLoading(false);
  }

  async function handleSearch(searchQuery: string) {
    setIsSearching(true);
    setError(null);
    try {
      const searchResults = await searchContentAction(searchQuery);
      setResults(searchResults);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header
        user={user}
        isAuthLoading={authLoading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-16 pt-14 sm:pt-10">
        <div className="mb-12 text-center">
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Search across Web Dev Simplified videos and articles by meaning, not
            keywords — and jump straight to the section that matters.
          </p>
        </div>

        <SearchBar
          isSignedIn={!!user}
          isSearching={isSearching}
          onSearch={handleSearch}
          onSignIn={handleSignIn}
        />

        <div className="flex w-full max-w-2xl flex-col gap-3 pt-10">
          {error && <p className="text-sm text-danger">{error}</p>}
          {results && results.length > 0 && (
            <ul className="flex flex-col gap-3">
              {results.map((result) => (
                <li key={result.id}>
                  <ResultCard result={result} />
                </li>
              ))}
            </ul>
          )}
          {results && results.length === 0 && !isSearching && (
            <p className="text-center text-sm text-muted-foreground">
              No results found. Try a different search.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
