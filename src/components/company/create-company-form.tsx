'use client';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { recommendedBasAccounts } from '@/data/bas-accounts';
import { createClient } from '@/lib/supabase/client';

export default function CreateCompanyForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [organisationNumber, setOrganisationNumber] = useState('');
  const [addRecommendedAccounts, setAddRecommendedAccounts] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');

    if (!name.trim()) {
      setError('Ange företagets namn.');
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setError('Du är inte längre inloggad.');
      return;
    }

    const { data: company, error: insertError } = await supabase
      .from('companies')
      .insert({
        owner_id: user.id,
        name: name.trim(),
        organization_number: organisationNumber.trim() || null,
        country: 'Sverige',
        default_currency: 'SEK',
        vat_registered: false,
        f_tax: false,
      })
      .select('id, owner_id')
      .single();

    console.log({
      userId: user.id,
      company,
      insertError,
    });

    if (insertError || !company) {
      setLoading(false);
      setError(insertError?.message ?? 'Kunde inte skapa företaget.');
      return;
    }

    // 2. Lägg till rekommenderad BAS-kontoplan
    if (addRecommendedAccounts) {
      const accounts = recommendedBasAccounts.map((account) => ({
        company_id: company.id,
        account_number: account.accountNumber,
        name: account.name,
        account_type: account.accountType,
        is_custom: false,
        active: true,
      }));

      const { error: accountsError } = await supabase
        .from('accounts')
        .insert(accounts);

      if (accountsError) {
        setLoading(false);
        setError(
          `Företaget skapades, men kontoplanen kunde inte läggas till: ${accountsError.message}`,
        );
        return;
      }
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
          maxWidth: 520,
        }}>
        <Stack
          spacing={2}
          sx={{
            textAlign: 'center',
            mb: 3,
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
            <BusinessOutlinedIcon />
          </Box>

          <Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              Skapa ditt företag
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Fyll i grunduppgifterna för att komma igång med SIMOrdning.
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
            <Box component='form' onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {error && <Alert severity='error'>{error}</Alert>}

                <TextField
                  label='Företagsnamn'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  fullWidth
                  autoFocus
                />

                <TextField
                  label='Organisationsnummer'
                  value={organisationNumber}
                  onChange={(event) =>
                    setOrganisationNumber(event.target.value)
                  }
                  fullWidth
                  placeholder='XXXXXX-XXXX'
                  helperText='Frivilligt – kan läggas till senare'
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={addRecommendedAccounts}
                      onChange={(event) =>
                        setAddRecommendedAccounts(event.target.checked)
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        Lägg till rekommenderad kontoplan
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 0.25 }}>
                        Lägger till vanliga BAS-konton för att snabbt komma
                        igång.
                      </Typography>
                    </Box>
                  }
                  sx={{
                    alignItems: 'flex-start',
                    m: 0,
                  }}
                />

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
                  {loading ? 'Skapar företag...' : 'Skapa företag'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
