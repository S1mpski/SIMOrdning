import { Box, Typography } from '@mui/material';

import LogoutButton from '@/components/auth/logout-button';
import CompanyNameForm from '@/components/company/company-name-form';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyId, companyName }: Props) {
  return (
    <Box
      component='header'
      sx={{
        height: 72,
        px: 4,
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
            mb: 0.25,
          }}>
          Aktivt företag
        </Typography>

        <CompanyNameForm companyId={companyId} initialName={companyName} />
      </Box>

      <LogoutButton />
    </Box>
  );
}
