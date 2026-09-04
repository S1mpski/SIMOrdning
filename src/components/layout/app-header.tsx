'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, IconButton, Typography } from '@mui/material';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyName }: Props) {
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const [headerWidth, setHeaderWidth] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    const observer = new ResizeObserver(([entry]) => {
      setHeaderWidth(entry.contentRect.width);
    });

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  const startX = 80;

  const rightPadding = 140;

  const endX = Math.max(headerWidth - rightPadding, startX);

  const distance = endX - startX;

  const motionPath = `M ${startX} 30 C ${
    startX + distance * 0.08
  } 112, ${startX + distance * 0.16} -50, ${
    startX + distance * 0.24
  } 30 C ${startX + distance * 0.32} 64, ${
    startX + distance * 0.4
  } 62, ${startX + distance * 0.48} 30 C ${
    startX + distance * 0.56
  } -1, ${startX + distance * 0.64} -3, ${
    startX + distance * 0.72
  } 30 C ${startX + distance * 0.78} 64, ${
    startX + distance * 0.84
  } 62, ${startX + distance * 0.9} 30 C ${
    startX + distance * 0.94
  } -1, ${startX + distance * 0.97} -3, ${endX} 30`;

  return (
    <Box
      ref={headerRef}
      component='header'
      sx={{
        height: 88,
        px: 4,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 14,
          width: 'fit-content',
          whiteSpace: 'nowrap',

          offsetPath: `path("${motionPath}")`,
          offsetRotate: '0deg',

          animation: animationEnabled
            ? 'companyWave 30s linear infinite alternate'
            : 'none',

          offsetDistance: animationEnabled ? undefined : '100%',

          '@keyframes companyWave': {
            from: {
              offsetDistance: '100%',
            },
            to: {
              offsetDistance: '0%',
            },
          },
        }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: 'simBlue.main',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            mb: 0.25,
          }}>
          Aktivt företag
        </Typography>

        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.3px',
            color: 'text.primary',
          }}>
          {companyName}
        </Typography>
      </Box>

      <IconButton
        onClick={() => setAnimationEnabled((prev) => !prev)}
        disableRipple
        aria-label='Toggle company animation'
        sx={{
          position: 'absolute',
          right: 28,
          top: '50%',
          transform: 'translateY(-50%)',
          p: 0.5,
          opacity: 0.18,
          transition: 'opacity 0.2s ease, transform 0.2s ease',

          '&:hover': {
            opacity: 0.8,
            transform: 'translateY(-50%) scale(1.08)',
          },
        }}>
        <Box
          component='img'
          src='/blu-ray-logo.svg'
          alt=''
          sx={{
            width: 42,
            height: 'auto',
            display: 'block',
          }}
        />
      </IconButton>
    </Box>
  );
}
