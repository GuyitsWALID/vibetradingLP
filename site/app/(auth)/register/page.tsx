'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Moon, Sun } from 'lucide-react';

function GoogleLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3.1l3.1 2.4c1.8-1.6 2.8-4 2.8-6.9 0-.7-.1-1.4-.2-2H12Z" />
      <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 .9-3.3.9-2.6 0-4.8-1.7-5.5-4.1H3.3v2.5C4.8 19.8 8.1 22 12 22Z" />
      <path fill="#4A90E2" d="M6.5 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.5H3.3C2.5 9 2 10.5 2 12s.5 3 1.3 4.5L6.5 14Z" />
      <path fill="#FBBC05" d="M12 5.9c1.4 0 2.7.5 3.6 1.4l2.7-2.7C16.8 3.1 14.6 2 12 2 8.1 2 4.8 4.2 3.3 7.5l3.2 2.5c.7-2.4 2.9-4.1 5.5-4.1Z" />
    </svg>
  );
}

export default function RegisterPage() {
  const [dark, setDark] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard')}`;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

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
    <main className={`min-h-screen relative flex items-center justify-center px-6 py-12 ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[340px] rounded-full blur-[120px] ${dark ? 'bg-cyan/10' : 'bg-teal-300/10'}`} />
      </div>

      <div className={`relative z-10 w-full max-w-md border backdrop-blur-sm p-7 sm:p-8 rounded-2xl ${dark ? 'border-border bg-surface/70' : 'border-gray-200 bg-white/90'}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-semibold ${dark ? 'text-white' : 'text-black'}`}>Sign Up</h1>
          <button
            type="button"
            onClick={() => setDark((prev) => !prev)}
            className={`h-9 w-9 rounded-full border inline-flex items-center justify-center transition-colors ${dark ? 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:text-cyan' : 'border-gray-300 bg-gray-100 text-gray-700 hover:text-teal-700'}`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        <p className={`text-sm ${dark ? 'text-secondary' : 'text-gray-600'}`}>Create your account and start your macro journey.</p>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className={`mt-6 w-full border px-4 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 rounded-xl ${dark ? 'border-border bg-black/70 text-white hover:border-cyan/40' : 'border-gray-300 bg-white text-black hover:border-teal-700/40'}`}
        >
          <GoogleLogo className="h-5 w-5" />
          {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
        </button>

        <div className="mt-5 mb-4 flex items-center gap-3">
          <div className={`h-px flex-1 ${dark ? 'bg-border' : 'bg-gray-300'}`} />
          <span className={`text-xs uppercase tracking-[0.12em] ${dark ? 'text-secondary' : 'text-gray-500'}`}>or</span>
          <div className={`h-px flex-1 ${dark ? 'bg-border' : 'bg-gray-300'}`} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className={`rounded-xl p-2 border ${dark ? 'border-border bg-black/25' : 'border-gray-200 bg-gray-50'}`}>
            <label htmlFor="displayName" className={`block text-sm mb-1 ${dark ? 'text-secondary' : 'text-gray-600'}`}>
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`w-full border px-3 py-2.5 text-sm outline-none rounded-lg ${dark ? 'border-border bg-black text-white focus:border-cyan' : 'border-gray-300 bg-white text-black focus:border-teal-700'}`}
            />
          </div>

          <div className={`rounded-xl p-2 border ${dark ? 'border-border bg-black/25' : 'border-gray-200 bg-gray-50'}`}>
            <label htmlFor="email" className={`block text-sm mb-1 ${dark ? 'text-secondary' : 'text-gray-600'}`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border px-3 py-2.5 text-sm outline-none rounded-lg ${dark ? 'border-border bg-black text-white focus:border-cyan' : 'border-gray-300 bg-white text-black focus:border-teal-700'}`}
            />
          </div>

          <div className={`rounded-xl p-2 border ${dark ? 'border-border bg-black/25' : 'border-gray-200 bg-gray-50'}`}>
            <label htmlFor="password" className={`block text-sm mb-1 ${dark ? 'text-secondary' : 'text-gray-600'}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border px-3 py-2.5 text-sm outline-none rounded-lg ${dark ? 'border-border bg-black text-white focus:border-cyan' : 'border-gray-300 bg-white text-black focus:border-teal-700'}`}
            />
          </div>

          {error && <p className="text-sm text-bearish">{error}</p>}
          {message && <p className="text-sm text-bullish">{message}</p>}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className={`w-full font-semibold py-2.5 text-sm disabled:opacity-60 rounded-xl ${dark ? 'bg-cyan text-black' : 'bg-teal-700 text-white'}`}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className={`mt-5 text-sm ${dark ? 'text-secondary' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link href="/login" className={`${dark ? 'text-cyan' : 'text-teal-700'} hover:underline`}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
