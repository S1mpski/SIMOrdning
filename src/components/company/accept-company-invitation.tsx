'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';

type Invitation = {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  companies:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
};

type Props = {
  invitation: Invitation;
};

export default function AcceptCompanyInvitation({ invitation }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const company = Array.isArray(invitation.companies)
    ? invitation.companies[0]
    : invitation.companies;

  async function handleAccept() {
    setLoading(true);
    setError('');

    const { error: acceptError } = await supabase.rpc(
      'accept_company_invitation',
      {
        p_invitation_id: invitation.id,
      },
    );

    if (acceptError) {
      setLoading(false);
      setError(acceptError.message);
      return;
    }

    router.push('/');
    router.refresh();
  }

  async function handleDecline() {
    const confirmed = window.confirm(
      `Vill du ta bort inbjudan till ${company?.name ?? 'företaget'}?`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError('');

    const { error: deleteError } = await supabase
      .from('company_invitations')
      .delete()
      .eq('id', invitation.id);

    if (deleteError) {
      setLoading(false);
      setError(deleteError.message);
      return;
    }

    router.refresh();
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        px: {
          xs: 2,
          sm: 3,
        },
        py: 6,
      }}>
      <Card
        variant='outlined'
        sx={{
          borderRadius: 2,
        }}>
        <CardContent
          sx={{
            p: 4,
            '&:last-child': {
              pb: 4,
            },
          }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 600,
                }}>
                Du har blivit inbjuden
              </Typography>

              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 600,
                }}>
                Inbjudan till {company?.name ?? 'företag'}
              </Typography>

              <Typography color='text.secondary' sx={{ mt: 1 }}>
                Du har blivit inbjuden att gå med i{' '}
                {company?.name ?? 'företaget'} på SIMOrdning.
              </Typography>
            </Box>

            <Box>
              <Typography variant='body2' color='text.secondary'>
                Inbjuden som
              </Typography>

              <Typography>
                {invitation.role === 'admin' ? 'Administratör' : 'Medlem'}
              </Typography>
            </Box>

            {error && <Alert severity='error'>{error}</Alert>}

            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}>
              <Button
                variant='contained'
                size='large'
                onClick={handleAccept}
                disabled={loading}
                sx={{ flex: 1 }}>
                {loading
                  ? 'Bearbetar...'
                  : `Gå med i ${company?.name ?? 'företaget'}`}
              </Button>

              <Button
                variant='outlined'
                color='error'
                size='large'
                onClick={handleDecline}
                disabled={loading}>
                Avböj
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
