import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  async function signOut() {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">Vibe Terminal</p>
            <h1 className="text-3xl font-semibold mt-2">Dashboard</h1>
            <p className="text-zinc-400 mt-2">No-signal macro workspace. News, calendar, context.</p>
          </div>

          <form action={signOut}>
            <button type="submit" className="border border-zinc-700 px-4 py-2 text-sm hover:border-cyan-500">
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-10 border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-300">Signed in as</p>
          <p className="text-lg font-medium mt-1">{user.email}</p>
        </div>
      </div>
    </main>
  );
}
