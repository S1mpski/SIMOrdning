'use client';

import { useRouter } from 'next/navigation';

import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';

import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push('/login');
    router.refresh();
  }

  return (
    <Button
      variant='outlined'
      startIcon={<LogoutIcon />}
      onClick={handleLogout}>
      Logga ut
    </Button>
  );
}
