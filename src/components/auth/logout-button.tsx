'use client';

import { useRouter } from 'next/navigation';

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

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
    <ListItemButton
      onClick={handleLogout}
      sx={{
        minHeight: 44,
        px: 1.5,
        mb: 1,
        borderRadius: 1,
        color: 'rgba(255,255,255,0.72)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.06)',
          color: '#fff',
        },
      }}>
      <ListItemIcon
        sx={{
          minWidth: 36,
          color: 'inherit',
          '& svg': {
            fontSize: 20,
          },
        }}>
        <LogoutOutlinedIcon />
      </ListItemIcon>

      <ListItemText
        primary='Logga ut'
        slotProps={{
          primary: {
            sx: {
              fontSize: 14,
              fontWeight: 600,
            },
          },
        }}
      />
    </ListItemButton>
  );
}
