import Image from 'next/image';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

import ResetPasswordForm from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
        }}>
        <Stack
          spacing={-2}
          sx={{
            mb: 1.5,
            textAlign: 'center',
          }}>
          <Box>
            <Image
              src='/simordning-logo.png'
              width={250}
              height={100}
              alt='SIMOrdning'
              priority
            />
          </Box>

          <Typography variant='caption' color='text.secondary'>
            Enkel bokföring, långsam hemsida
          </Typography>
        </Stack>

        <Card variant='outlined'>
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
              },
            }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  Återställ lösenord
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mt: 0.5 }}>
                  Välj ett nytt lösenord för ditt konto.
                </Typography>
              </Box>

              <ResetPasswordForm />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
