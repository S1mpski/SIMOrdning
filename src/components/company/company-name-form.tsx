'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';

import { createClient } from '@/lib/supabase/client';

type Props = {
  companyId: string;
  initialName: string;
};

export default function CompanyNameForm({ companyId, initialName }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Företagsnamnet får inte vara tomt.');
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createClient();

    const { error } = await supabase
      .from('companies')
      .update({
        name: trimmedName,
      })
      .eq('id', companyId);

    if (error) {
      setError('Kunde inte spara företagsnamnet.');
      setLoading(false);
      return;
    }

    setName(trimmedName);
    setEditing(false);
    setLoading(false);

    router.refresh();
  }

  if (!editing) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
        <Typography variant='h6' fontWeight={600}>
          {name}
        </Typography>

        <IconButton
          size='small'
          onClick={() => setEditing(true)}
          aria-label='Ändra företagsnamn'>
          <EditIcon fontSize='small' />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
      }}>
      <TextField
        size='small'
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={Boolean(error)}
        helperText={error}
        disabled={loading}
        autoFocus
        inputProps={{
          maxLength: 100,
        }}
        sx={{
          minWidth: 300,
        }}
      />

      <Button
        type='submit'
        variant='contained'
        startIcon={<CheckIcon />}
        disabled={loading}>
        {loading ? 'Sparar...' : 'Spara'}
      </Button>

      <Button
        type='button'
        variant='text'
        disabled={loading}
        onClick={() => {
          setName(initialName);
          setError('');
          setEditing(false);
        }}>
        Avbryt
      </Button>
    </Box>
  );
}
