'use client';

import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';

type Props = {
  email: string;
};

export default function AccountSettingsForm({ email }: Props) {
  const [savedEmail, setSavedEmail] = useState(email);
  const [newEmail, setNewEmail] = useState(email);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [emailSuccess, setEmailSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleEmailChange() {
    const cleanEmail = newEmail.trim().toLowerCase();

    setEmailSuccess('');
    setEmailError('');

    if (!cleanEmail) {
      setEmailError('Ange en e-postadress.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError('Ange en giltig e-postadress.');
      return;
    }

    if (cleanEmail === savedEmail.toLowerCase()) {
      return;
    }

    setEmailLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        email: cleanEmail,
      });

      if (error) {
        throw error;
      }

      setEmailSuccess(
        'En bekräftelselänk har skickats. E-postadressen ändras när den har bekräftats.',
      );
    } catch (error) {
      console.error(error);

      setEmailError('Kunde inte ändra e-postadressen.');
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordChange() {
    setPasswordSuccess('');
    setPasswordError('');

    if (!newPassword) {
      setPasswordError('Ange ett nytt lösenord.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Lösenordet måste innehålla minst 6 tecken.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Lösenorden matchar inte.');
      return;
    }

    setPasswordLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setNewPassword('');
      setConfirmPassword('');

      setPasswordSuccess('Lösenordet har ändrats.');
    } catch (error) {
      console.error(error);

      setPasswordError('Kunde inte ändra lösenordet.');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>
          E-postadress
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mt: 0.5, mb: 2 }}>
          Ändra e-postadressen som används för inloggning.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label='E-post'
            type='email'
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            fullWidth
            autoComplete='email'
          />

          {emailSuccess && <Alert severity='success'>{emailSuccess}</Alert>}

          {emailError && <Alert severity='error'>{emailError}</Alert>}

          <Button
            variant='contained'
            onClick={handleEmailChange}
            disabled={
              emailLoading ||
              newEmail.trim() === '' ||
              newEmail.trim().toLowerCase() === savedEmail.toLowerCase()
            }
            sx={{
              alignSelf: 'flex-start',
            }}>
            {emailLoading ? 'Skickar...' : 'Ändra e-post'}
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>
          Byt lösenord
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mt: 0.5, mb: 2 }}>
          Välj ett nytt lösenord för ditt konto.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label='Nytt lösenord'
            type='password'
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            fullWidth
            autoComplete='new-password'
          />

          <TextField
            label='Bekräfta nytt lösenord'
            type='password'
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            fullWidth
            autoComplete='new-password'
          />

          {passwordSuccess && (
            <Alert severity='success'>{passwordSuccess}</Alert>
          )}

          {passwordError && <Alert severity='error'>{passwordError}</Alert>}

          <Button
            variant='contained'
            onClick={handlePasswordChange}
            disabled={
              passwordLoading || newPassword === '' || confirmPassword === ''
            }
            sx={{
              alignSelf: 'flex-start',
            }}>
            {passwordLoading ? 'Sparar...' : 'Byt lösenord'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
