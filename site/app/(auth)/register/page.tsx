'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setMessage('Account created. Check your email to confirm your account if required.');
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-zinc-400">Join the no-signal macro terminal community.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm mb-1 text-zinc-300">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-zinc-700 bg-black px-3 py-2 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-zinc-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-zinc-700 bg-black px-3 py-2 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-700 bg-black px-3 py-2 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-black font-semibold py-2 text-sm disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
