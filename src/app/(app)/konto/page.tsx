import AccountSettingsForm from '@/components/account/account-settings-form';
import { createClient } from '@/lib/supabase/server';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
      }}>
      <Stack spacing={3}>
        <Box>
          <Typography component='h1' variant='h4' sx={{ fontWeight: 700 }}>
            Kontoinställningar
          </Typography>

          <Typography color='text.secondary' sx={{ mt: 0.5 }}>
            Hantera din e-postadress och ditt lösenord.
          </Typography>
        </Box>

        <Card variant='outlined'>
          <CardContent>
            <AccountSettingsForm email={user.email ?? ''} />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
