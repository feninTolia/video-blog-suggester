'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from '@/lib/auth/auth-client';

export default function Home() {
  const { data: session, isPending } = useSession();
  const [authLoading, setAuthLoading] = useState(false);

  function handleSignIn() {
    setAuthLoading(true);
    signIn.social({ provider: 'github' });
  }

  async function handleSignOut() {
    setAuthLoading(true);
    await signOut();
    setAuthLoading(false);
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {authLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <svg
            className="h-8 w-8 animate-spin text-zinc-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
      {!session ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-zinc-500">Sign in to continue</p>
          <button
            onClick={handleSignIn}
            disabled={authLoading}
            className="rounded-lg bg-zinc-900 px-6 py-2 text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <img
            src={session.user.image ?? ''}
            alt={session.user.name}
            className="h-16 w-16 rounded-full"
          />
          <p className="text-lg font-medium">{session.user.name}</p>

          <button
            onClick={handleSignOut}
            disabled={authLoading}
            className="rounded-lg bg-zinc-900 px-6 py-2 text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
