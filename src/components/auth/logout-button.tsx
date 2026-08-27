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
      variant='text'
      color='inherit'
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{
        color: 'text.secondary',
        fontSize: 13,

        '&:hover': {
          color: 'text.primary',
          bgcolor: 'action.hover',
        },
      }}>
      Logga ut
    </Button>
  );
}
