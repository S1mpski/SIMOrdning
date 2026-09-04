'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyName }: Props) {
  const [animationEnabled, setAnimationEnabled] = useState(false);

  const companyRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef({
    x: 0,
    y: 0,
    vx: -0.7,
    vy: 0.45,
  });

  const frameRef = useRef<number | null>(null);

  function toggleAnimation() {
    const company = companyRef.current;

    if (!company) return;

    if (!animationEnabled) {
      // Läs den riktiga vilopositionen innan elementet blir fixed
      const rect = company.getBoundingClientRect();

      positionRef.current = {
        x: rect.left,
        y: rect.top,
        vx: -0.7,
        vy: 0.45,
      };

      setAnimationEnabled(true);
    } else {
      setAnimationEnabled(false);
    }
  }

  useEffect(() => {
    const company = companyRef.current;

    if (!company) return;

    if (!animationEnabled) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      // Viktigt: ta bort tidigare translate-position
      company.style.transform = 'none';

      return;
    }

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);

      lastTime = time;

      /*
       * Eftersom elementet använder transform måste vi inte använda
       * getBoundingClientRect() för x/y-positionen här.
       * Vi behöver bara dess storlek.
       */
      const companyWidth = company.offsetWidth;
      const companyHeight = company.offsetHeight;

      const padding = 12;

      const minX = padding;
      const maxX = window.innerWidth - companyWidth - padding;

      const minY = padding;
      const maxY = window.innerHeight - companyHeight - padding;

      const pos = positionRef.current;

      pos.x += pos.vx * delta;
      pos.y += pos.vy * delta;

      if (pos.x <= minX) {
        pos.x = minX;
        pos.vx = Math.abs(pos.vx);
      }

      if (pos.x >= maxX) {
        pos.x = maxX;
        pos.vx = -Math.abs(pos.vx);
      }

      if (pos.y <= minY) {
        pos.y = minY;
        pos.vy = Math.abs(pos.vy);
      }

      if (pos.y >= maxY) {
        pos.y = maxY;
        pos.vy = -Math.abs(pos.vy);
      }

      company.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [animationEnabled]);

  return (
    <Box
      component='header'
      sx={{
        height: 88,
        px: 4,
        position: 'relative',
        overflow: 'visible',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
      <Box
        ref={companyRef}
        onClick={toggleAnimation}
        role='button'
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleAnimation();
          }
        }}
        sx={{
          position: animationEnabled ? 'fixed' : 'absolute',

          left: animationEnabled ? 0 : 'auto',
          right: animationEnabled ? 'auto' : 40,

          top: animationEnabled ? 0 : 20,

          width: 'fit-content',
          whiteSpace: 'nowrap',

          zIndex: animationEnabled ? 9999 : 'auto',

          cursor: 'pointer',
          userSelect: 'none',

          willChange: 'transform',

          '&:hover': {
            opacity: 0.85,
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
            textAlign: 'center',
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
    </Box>
  );
}
