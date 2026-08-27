'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  function handleModeChange(newMode: 'login' | 'register') {
    setMode(newMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replaceAll('å', 'a')
      .replaceAll('ä', 'a')
      .replaceAll('ö', 'o')
      .replace(/\s+/g, '.');

    if (!cleanUsername) {
      setError('Ange ett användarnamn.');
      return;
    }

    if (!password) {
      setError('Ange ett lösenord.');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste innehålla minst 6 tecken.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const email = `${cleanUsername}@example.com`;

    if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
      setError(
        'Användarnamnet får bara innehålla bokstäver, siffror, punkt, bindestreck och understreck.',
      );
      return;
    }

    if (isRegister) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setLoading(false);

        if (
          signUpError.message.toLowerCase().includes('already registered') ||
          signUpError.message.toLowerCase().includes('already exists')
        ) {
          setError('Användarnamnet är redan upptaget.');
          return;
        }

        setError(signUpError.message);
        return;
      }

      if (!data.session) {
        setLoading(false);
        setError(
          'Kontot skapades, men automatisk inloggning misslyckades. Kontrollera inställningen för e-postbekräftelse i Supabase.',
        );
        return;
      }

      router.push('/skapa-foretag');
      router.refresh();
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError('Fel användarnamn eller lösenord.');
      return;
    }

    router.push('/');
    router.refresh();
  }

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
          spacing={2}
          sx={{
            mb: 3,
            textAlign: 'center',
          }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: 'auto',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}>
            <LockOutlinedIcon />
          </Box>

          <Box>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,
              }}>
              SIMOrdning
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mt: 0.5,
              }}>
              Enkel och tydlig bokföring
            </Typography>
          </Box>
        </Stack>

        <Card variant='outlined'>
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
              },
            }}>
            <Tabs
              value={mode}
              onChange={(_, value) =>
                handleModeChange(value as 'login' | 'register')
              }
              variant='fullWidth'
              sx={{
                mb: 3,
              }}>
              <Tab value='login' label='Logga in' />

              <Tab value='register' label='Skapa konto' />
            </Tabs>

            <Box component='form' onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 700,
                    }}>
                    {isRegister ? 'Skapa ditt konto' : 'Välkommen tillbaka'}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      mt: 0.5,
                    }}>
                    {isRegister
                      ? 'Välj ett användarnamn och lösenord för att komma igång.'
                      : 'Logga in för att fortsätta till ditt företag.'}
                  </Typography>
                </Box>

                <Divider />

                {error && <Alert severity='error'>{error}</Alert>}

                <TextField
                  label='Användarnamn'
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  fullWidth
                  autoComplete='username'
                  autoFocus
                />

                <TextField
                  label='Lösenord'
                  type='password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  fullWidth
                  autoComplete={
                    isRegister ? 'new-password' : 'current-password'
                  }
                />

                {isRegister && (
                  <TextField
                    label='Bekräfta lösenord'
                    type='password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    fullWidth
                    autoComplete='new-password'
                  />
                )}

                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.3,
                    fontWeight: 600,
                  }}>
                  {loading
                    ? isRegister
                      ? 'Skapar konto...'
                      : 'Loggar in...'
                    : isRegister
                      ? 'Skapa konto'
                      : 'Logga in'}
                </Button>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    textAlign: 'center',
                  }}>
                  {isRegister
                    ? 'Har du redan ett konto?'
                    : 'Har du inget konto ännu?'}

                  <Button
                    type='button'
                    variant='text'
                    size='small'
                    onClick={() =>
                      handleModeChange(isRegister ? 'login' : 'register')
                    }
                    sx={{
                      ml: 0.5,
                    }}>
                    {isRegister ? 'Logga in' : 'Skapa konto'}
                  </Button>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
