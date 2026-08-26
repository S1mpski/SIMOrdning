'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AccountBalance,
  AddCircleOutlineOutlined,
  Dashboard,
  Description,
  ListAlt,
  ReceiptLong,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

const menuItems = [
  {
    label: 'Översikt',
    href: '/',
    icon: <Dashboard />,
  },
  {
    label: 'Ny verifikation',
    href: '/ny-verifikation',
    icon: <AddCircleOutlineOutlined />,
  },
  {
    label: 'Verifikationer',
    href: '/verifikationer',
    icon: <ReceiptLong />,
  },
  {
    label: 'Kontoplan',
    href: '/kontoplan',
    icon: <ListAlt />,
  },
  {
    label: 'Rapporter',
    href: '/rapporter',
    icon: <Description />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      component='aside'
      sx={{
        width: 250,
        minWidth: 250,
        minHeight: '100vh',
        bgcolor: '#202226',
        color: 'white',
      }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}>
          <AccountBalance />

          <Typography variant='h6' fontWeight={700}>
            SIMOrdning
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const selected = pathname === item.href;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                color: 'rgba(255,255,255,0.8)',

                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                },

                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: 'white',
                },

                '&.Mui-selected:hover': {
                  bgcolor: 'rgba(255,255,255,0.16)',
                },

                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}>
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
