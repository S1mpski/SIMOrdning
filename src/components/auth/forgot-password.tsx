'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

type Props = {
  onBack: () => void;
};

export default function ForgotPassword({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setLoading(true);
    setSuccess('');
    setErrorMessage('');

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/aterstall-losenord`,
        },
      );

      if (error) {
        throw error;
      }

      setSuccess(
        'Om ett konto finns med den e-postadressen har en återställningslänk skickats.',
      );
    } catch (error) {
      console.error(error);
      setErrorMessage('Kunde inte skicka återställningslänken.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          Glömt lösenord
        </Typography>

        <Typography color='text.secondary'>
          Ange din e-postadress så skickar vi en återställningslänk.
        </Typography>
      </Stack>

      <TextField
        label='E-post'
        type='email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        fullWidth
        autoComplete='email'
      />

      {success && <Alert severity='success'>{success}</Alert>}

      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}

      <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={loading || email.trim() === ''}>
        {loading ? 'Skickar...' : 'Skicka återställningslänk'}
      </Button>

      <Button variant='text' onClick={onBack}>
        Tillbaka till inloggning
      </Button>
    </Stack>
  );
}
