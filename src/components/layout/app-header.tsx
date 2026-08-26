import { Box, Paper, Typography } from '@mui/material';

import LogoutButton from '@/components/auth/logout-button';
import CompanyNameForm from '@/components/company/company-name-form';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyId, companyName }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 3,
        py: 2,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
        }}>
        <Box>
          <Typography variant='caption' color='text.secondary'>
            Aktivt företag
          </Typography>

          <CompanyNameForm companyId={companyId} initialName={companyName} />
        </Box>

        <LogoutButton />
      </Box>
    </Paper>
  );
}
