'use client';

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push('/login');
    router.refresh();
  }

  return <button onClick={handleLogout}>Logga ut</button>;
}
