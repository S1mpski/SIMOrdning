'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

const bookkeepingItems = [
  {
    label: 'Översikt',
    href: '/',
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: 'Ny verifikation',
    href: '/ny-verifikation',
    icon: <AddOutlinedIcon />,
  },
  {
    label: 'Verifikationer',
    href: '/verifikationer',
    icon: <DescriptionOutlinedIcon />,
  },
  {
    label: 'Kontoplan',
    href: '/kontoplan',
    icon: <MenuBookOutlinedIcon />,
  },
  {
    label: 'Rapporter',
    href: '/rapporter',
    icon: <AssessmentOutlinedIcon />,
  },
];

const companyItems = [
  {
    label: 'Företagsuppgifter',
    href: '/foretag',
    icon: <BusinessOutlinedIcon />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function renderMenuItems(
    items: {
      label: string;
      href: string;
      icon: React.ReactNode;
    }[],
  ) {
    return items.map((item) => {
      const selected =
        item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

      return (
        <ListItemButton
          key={item.href}
          component={Link}
          href={item.href}
          selected={selected}
          sx={{
            minHeight: 44,
            px: 1.5,
            mb: 1,
            borderRadius: 1,
            color: 'rgba(255,255,255,0.72)',
            '& .MuiListItemIcon-root': {
              color: 'inherit',
            },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.06)',
              color: '#fff',
            },
            '&.Mui-selected': {
              bgcolor: 'rgba(255,255,255,0.1)',
              color: '#fff',
            },
            '&.Mui-selected:hover': {
              bgcolor: 'rgba(255,255,255,0.12)',
            },
          }}>
          <ListItemIcon
            sx={{
              minWidth: 36,
              '& svg': {
                fontSize: 20,
              },
            }}>
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.label}
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
    });
  }

  return (
    <Box
      component='aside'
      sx={{
        width: 240,
        minWidth: 240,
        minHeight: '100vh',
        bgcolor: '#202225',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-0.3px',
          }}>
          SIMOrdning
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, py: 2 }}>
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            color: 'rgba(255,255,255,0.4)',
          }}>
          Bokföring
        </Typography>

        <List disablePadding>{renderMenuItems(bookkeepingItems)}</List>

        <Typography
          sx={{
            px: 1.5,
            mt: 3,
            mb: 1,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            color: 'rgba(255,255,255,0.4)',
          }}>
          Företag
        </Typography>

        <List disablePadding>{renderMenuItems(companyItems)}</List>
      </Box>
    </Box>
  );
}
