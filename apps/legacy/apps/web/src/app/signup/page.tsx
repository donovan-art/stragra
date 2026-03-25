'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, Input, Card } from '@stragra/ui';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      try {
        // Get the session token — present on auto-confirm, null if email confirmation required
        const token = data.session?.access_token;

        if (token) {
          await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email, name }),
          }).catch(console.error);
        }

        router.push('/');
      } catch (err) {
        console.error('Profile setup error:', err);
        router.push('/');
      }
    } else {
      setError('Check your email to confirm your account before signing in.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md p-8 bg-zinc-900 border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">virtualStragra</h1>
        <p className="text-zinc-400 text-sm text-center mb-6">Create your account</p>
        {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-950/40 rounded-lg">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            required
          />
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            required
            minLength={6}
          />
          <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-center text-zinc-400 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-teal-500 hover:underline">Sign in</a>
        </p>
      </Card>
    </div>
  );
}
