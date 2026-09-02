'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Alert, Button, Stack, TextField } from '@mui/material';

import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit() {
    setSuccess('');
    setErrorMessage('');

    if (!password) {
      setErrorMessage('Ange ett nytt lösenord.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Lösenordet måste innehålla minst 6 tecken.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Lösenorden matchar inte.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      setPassword('');
      setConfirmPassword('');
      setSuccess('Lösenordet har ändrats.');

      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        'Kunde inte återställa lösenordet. Länken kan ha gått ut eller redan ha använts.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={2.5}>
      <TextField
        label='Nytt lösenord'
        type='password'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        fullWidth
        autoComplete='new-password'
        autoFocus
      />

      <TextField
        label='Bekräfta nytt lösenord'
        type='password'
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        fullWidth
        autoComplete='new-password'
      />

      {success && <Alert severity='success'>{success}</Alert>}

      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}

      <Button
        variant='contained'
        size='large'
        fullWidth
        onClick={handleSubmit}
        disabled={loading || password === '' || confirmPassword === ''}
        sx={{
          py: 1.3,
          fontWeight: 600,
          bgcolor: 'simBlue.main',
        }}>
        {loading ? 'Sparar...' : 'Spara nytt lösenord'}
      </Button>
    </Stack>
  );
}
