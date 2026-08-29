'use client';

import GitHubIcon from '@mui/icons-material/GitHub';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

import { Box, Button, Link, Stack, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component='footer'
      sx={{
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: 2.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}>
      <Stack
        direction='row'
        sx={{
          justifyContent: 'space-around',
        }}>
        <Typography variant='body2' color='text.secondary'>
          © {new Date().getFullYear()} SIMOrdning
        </Typography>

        <Link
          href='DIN_GITHUB_LÄNK'
          target='_blank'
          rel='noopener noreferrer'
          color='text.secondary'
          underline='hover'
          sx={{
            display: 'flex',

            gap: 0.75,
            fontSize: 14,
          }}>
          <GitHubIcon fontSize='small' />
          GitHub
        </Link>
        <Button
          variant='text'
          size='small'
          startIcon={<ReportProblemOutlinedIcon />}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            px: { xs: 2, sm: 3, md: 4 },
            py: 0,
          }}>
          Rapportera problem
        </Button>
      </Stack>
    </Box>
  );
}
