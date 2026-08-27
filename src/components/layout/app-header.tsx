import { Box, Typography } from '@mui/material';

import LogoutButton from '@/components/auth/logout-button';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyName }: Props) {
  return (
    <Box
      component='header'
      sx={{
        height: 72,
        px: 4,
        py: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
      <Box>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            my: 0.25,
          }}>
          Aktivt företag
        </Typography>

        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            textTransform: 'uppercase',
            mb: 0.25,
          }}>
          {companyName}
        </Typography>
      </Box>

      <LogoutButton />
    </Box>
  );
}
