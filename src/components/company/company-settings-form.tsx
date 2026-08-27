'use client';

import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';

type Company = {
  id: string;
  name: string | null;
  organization_number: string | null;
  company_type: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  vat_number: string | null;
  vat_registered: boolean | null;
  f_tax: boolean | null;
  fiscal_year_start: string | null;
  fiscal_year_end: string | null;
  default_currency: string | null;
};

type Props = {
  company: Company;
};

export default function CompanySettingsForm({ company }: Props) {
  const supabase = createClient();

  const [form, setForm] = useState({
    name: company.name ?? '',
    organization_number: company.organization_number ?? '',
    company_type: company.company_type ?? '',
    address: company.address ?? '',
    postal_code: company.postal_code ?? '',
    city: company.city ?? '',
    country: company.country ?? 'Sverige',
    email: company.email ?? '',
    phone: company.phone ?? '',
    website: company.website ?? '',
    vat_number: company.vat_number ?? '',
    vat_registered: company.vat_registered ?? false,
    f_tax: company.f_tax ?? false,
    fiscal_year_start: company.fiscal_year_start ?? '',
    fiscal_year_end: company.fiscal_year_end ?? '',
    default_currency: company.default_currency ?? 'SEK',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    setError('');

    const { error: updateError } = await supabase
      .from('companies')
      .update({
        name: form.name,
        organization_number: form.organization_number || null,
        company_type: form.company_type || null,
        address: form.address || null,
        postal_code: form.postal_code || null,
        city: form.city || null,
        country: form.country || null,
        email: form.email || null,
        phone: form.phone || null,
        website: form.website || null,
        vat_number: form.vat_number || null,
        vat_registered: form.vat_registered,
        f_tax: form.f_tax,
        fiscal_year_start: form.fiscal_year_start || null,
        fiscal_year_end: form.fiscal_year_end || null,
        default_currency: form.default_currency || 'SEK',
      })
      .eq('id', company.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.4px',
          }}>
          Företagsuppgifter
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Hantera företagets grunduppgifter och bokföringsinställningar.
        </Typography>
      </Box>

      {success && (
        <Alert severity='success'>Företagsuppgifterna har sparats.</Alert>
      )}

      {error && <Alert severity='error'>{error}</Alert>}

      <Card variant='outlined'>
        <CardContent>
          <Stack spacing={3}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}>
              Grunduppgifter
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label='Företagsnamn'
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label='Organisationsnummer'
                  value={form.organization_number}
                  onChange={(event) =>
                    updateField('organization_number', event.target.value)
                  }
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Företagsform</InputLabel>

                  <Select
                    label='Företagsform'
                    value={form.company_type}
                    onChange={(event) =>
                      updateField('company_type', event.target.value)
                    }>
                    <MenuItem value=''>
                      <em>Ej angiven</em>
                    </MenuItem>
                    <MenuItem value='enskild_firma'>Enskild firma</MenuItem>
                    <MenuItem value='aktiebolag'>Aktiebolag</MenuItem>
                    <MenuItem value='handelsbolag'>Handelsbolag</MenuItem>
                    <MenuItem value='kommanditbolag'>Kommanditbolag</MenuItem>
                    <MenuItem value='ekonomisk_forening'>
                      Ekonomisk förening
                    </MenuItem>
                    <MenuItem value='ideell_forening'>Ideell förening</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Standardvaluta</InputLabel>

                  <Select
                    label='Standardvaluta'
                    value={form.default_currency}
                    onChange={(event) =>
                      updateField('default_currency', event.target.value)
                    }>
                    <MenuItem value='SEK'>SEK</MenuItem>
                    <MenuItem value='EUR'>EUR</MenuItem>
                    <MenuItem value='USD'>USD</MenuItem>
                    <MenuItem value='NOK'>NOK</MenuItem>
                    <MenuItem value='DKK'>DKK</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Stack spacing={3}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}>
              Kontaktuppgifter
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label='Adress'
                  value={form.address}
                  onChange={(event) =>
                    updateField('address', event.target.value)
                  }
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label='Postnummer'
                  value={form.postal_code}
                  onChange={(event) =>
                    updateField('postal_code', event.target.value)
                  }
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label='Ort'
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label='Land'
                  value={form.country}
                  onChange={(event) =>
                    updateField('country', event.target.value)
                  }
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label='E-post'
                  type='email'
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label='Telefon'
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label='Webbplats'
                  value={form.website}
                  onChange={(event) =>
                    updateField('website', event.target.value)
                  }
                  fullWidth
                  size='small'
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Stack spacing={3}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}>
              Skatt och moms
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.vat_registered}
                    onChange={(event) =>
                      updateField('vat_registered', event.target.checked)
                    }
                  />
                }
                label='Momsregistrerad'
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.f_tax}
                    onChange={(event) =>
                      updateField('f_tax', event.target.checked)
                    }
                  />
                }
                label='Godkänd för F-skatt'
              />
            </Stack>

            <TextField
              label='VAT-nummer'
              value={form.vat_number}
              onChange={(event) =>
                updateField('vat_number', event.target.value)
              }
              fullWidth
              size='small'
              disabled={!form.vat_registered}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Stack spacing={3}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}>
              Räkenskapsår
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label='Startdatum'
                  type='date'
                  value={form.fiscal_year_start}
                  onChange={(event) =>
                    updateField('fiscal_year_start', event.target.value)
                  }
                  fullWidth
                  size='small'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label='Slutdatum'
                  type='date'
                  value={form.fiscal_year_end}
                  onChange={(event) =>
                    updateField('fiscal_year_end', event.target.value)
                  }
                  fullWidth
                  size='small'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <Button variant='contained' onClick={handleSave} disabled={saving}>
          {saving ? 'Sparar...' : 'Spara ändringar'}
        </Button>
      </Box>
    </Stack>
  );
}
