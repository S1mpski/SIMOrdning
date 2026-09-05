'use client';

import { useState } from 'react';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import Image from 'next/image';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';

import { useThemeMode } from '@/components/providers/theme-provider';

import LogoutButton from '@/components/auth/logout-button';

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

  const { mode, toggleTheme } = useThemeMode();

  const [collapsed, setCollapsed] = useState(false);

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

      const button = (
        <ListItemButton
          key={item.href}
          component={Link}
          href={item.href}
          selected={selected}
          sx={{
            minHeight: 44,

            px: collapsed ? 1 : 1.5,

            mb: 1,

            borderRadius: 1,

            justifyContent: collapsed ? 'center' : 'flex-start',

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
              minWidth: collapsed ? 0 : 36,

              justifyContent: 'center',

              '& svg': {
                fontSize: 20,
              },
            }}>
            {item.icon}
          </ListItemIcon>

          {!collapsed && (
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
          )}
        </ListItemButton>
      );

      if (collapsed) {
        return (
          <Tooltip key={item.href} title={item.label} placement='right'>
            {button}
          </Tooltip>
        );
      }

      return button;
    });
  }

  return (
    <Box
      component='aside'
      sx={{
        width: collapsed ? 72 : 240,
        minWidth: collapsed ? 72 : 240,

        minHeight: '100vh',

        bgcolor: '#202225',

        color: '#fff',

        display: 'flex',
        flexDirection: 'column',

        overflow: 'hidden',

        transition: 'width 0.25s ease, min-width 0.25s ease',
      }}>
      {/* LOGO + TOGGLE */}
      <Box
        sx={{
          height: 88,

          px: collapsed ? 1 : 2.5,

          display: 'flex',
          alignItems: 'center',

          justifyContent: collapsed ? 'center' : 'space-between',

          flexShrink: 0,
        }}>
        {!collapsed && (
          <Image
            src='/simordning-logo.png'
            alt='SIMOrdning'
            width={170}
            height={55}
            priority
            style={{
              width: '170px',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        )}

        <Tooltip
          title={collapsed ? 'Öppna sidomeny' : 'Stäng sidomeny'}
          placement='right'>
          <IconButton
            onClick={() => setCollapsed((prev) => !prev)}
            size='small'
            aria-label={collapsed ? 'Öppna sidomeny' : 'Stäng sidomeny'}
            sx={{
              color: 'rgba(255,255,255,0.7)',

              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.08)',
                color: '#fff',
              },
            }}>
            {collapsed ? (
              <ChevronRightOutlinedIcon />
            ) : (
              <ChevronLeftOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          px: collapsed ? 1 : 1.5,
          py: 2,
        }}>
        {/* BOKFÖRING */}
        {!collapsed && (
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
        )}

        <List disablePadding>{renderMenuItems(bookkeepingItems)}</List>

        {/* FÖRETAG */}
        {!collapsed && (
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
        )}

        {collapsed && <Box sx={{ mt: 2 }} />}

        <List disablePadding>{renderMenuItems(companyItems)}</List>

        {/* INSTÄLLNINGAR */}
        {!collapsed && (
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
            Inställningar
          </Typography>
        )}

        {collapsed && <Box sx={{ mt: 2 }} />}

        <List disablePadding>
          {/* DARK MODE */}
          <Tooltip title={collapsed ? 'Mörkt läge' : ''} placement='right'>
            <ListItemButton
              onClick={toggleTheme}
              sx={{
                minHeight: 44,

                px: collapsed ? 1 : 1.5,

                mb: 1,

                borderRadius: 1,

                justifyContent: collapsed ? 'center' : 'flex-start',

                color: 'rgba(255,255,255,0.72)',

                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                },

                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                },
              }}>
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 36,

                  justifyContent: 'center',

                  '& svg': {
                    fontSize: 20,
                  },
                }}>
                <DarkModeOutlinedIcon />
              </ListItemIcon>

              {!collapsed && (
                <>
                  <ListItemText
                    primary='Mörkt läge'
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: 14,
                          fontWeight: 600,
                        },
                      },
                    }}
                  />

                  <Switch
                    size='small'
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                    onClick={(event) => event.stopPropagation()}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'simBlue.main',
                      },

                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: 'simBlue.main',
                          opacity: 1,
                        },
                    }}
                  />
                </>
              )}
            </ListItemButton>
          </Tooltip>

          {/* KONTO */}
          <Tooltip title={collapsed ? 'Konto' : ''} placement='right'>
            <ListItemButton
              component={Link}
              href='/konto'
              selected={pathname === '/konto' || pathname.startsWith('/konto/')}
              sx={{
                minHeight: 44,

                px: collapsed ? 1 : 1.5,

                mb: 1,

                borderRadius: 1,

                justifyContent: collapsed ? 'center' : 'flex-start',

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
                  minWidth: collapsed ? 0 : 36,

                  justifyContent: 'center',

                  '& svg': {
                    fontSize: 20,
                  },
                }}>
                <PersonOutlineOutlinedIcon />
              </ListItemIcon>

              {!collapsed && (
                <ListItemText
                  primary='Konto'
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 14,
                        fontWeight: 600,
                      },
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>

          {/* LOGGA UT */}
          {!collapsed && <LogoutButton />}
        </List>
      </Box>
    </Box>
  );
}
