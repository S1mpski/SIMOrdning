'use client';

import { FormEvent, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

import ForgotPassword from '@/components/auth/forgot-password';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [forgotPassword, setForgotPassword] = useState(false);

  const isRegister = mode === 'register';

  function handleModeChange(newMode: 'login' | 'register') {
    setMode(newMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Ange en e-postadress.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Ange en giltig e-postadress.');
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

    try {
      const supabase = createClient();

      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (signUpError) {
          const message = signUpError.message.toLowerCase();

          if (
            message.includes('already registered') ||
            message.includes('already exists')
          ) {
            setError('Det finns redan ett konto med den e-postadressen.');
            return;
          }

          setError(signUpError.message);
          return;
        }

        if (!data.user) {
          setError('Kontot kunde inte skapas.');
          return;
        }

        if (!data.session) {
          setError(
            'Kontot skapades. Kontrollera din e-post för att bekräfta kontot innan du loggar in.',
          );
          return;
        }

        router.push('/skapa-foretag');
        router.refresh();

        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        setError('Fel e-postadress eller lösenord.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);

      setError('Något gick fel. Försök igen.');
    } finally {
      setLoading(false);
    }
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

          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              mt: 0,
            }}>
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
            {forgotPassword ? (
              <ForgotPassword
                onBack={() => {
                  setForgotPassword(false);
                  setError('');
                }}
              />
            ) : (
              <>
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
                          ? 'Ange din e-postadress och ett lösenord du kommer ihåg.'
                          : 'Logga in för att fortsätta till ditt företag.'}
                      </Typography>
                    </Box>

                    <Divider />

                    {error && <Alert severity='error'>{error}</Alert>}

                    <TextField
                      label='E-post'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      fullWidth
                      autoComplete='email'
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

                    {!isRegister && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: -1,
                        }}></Box>
                    )}

                    {isRegister && (
                      <TextField
                        label='Bekräfta lösenord'
                        type='password'
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
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
                        bgcolor: 'simBlue.main',
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
                    <Button
                      type='button'
                      variant='text'
                      size='small'
                      sx={{ py: -3 }}
                      onClick={() => {
                        setError('');
                        setForgotPassword(true);
                      }}>
                      Glömt lösenord?
                    </Button>
                  </Stack>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
