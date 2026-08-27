'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import VoucherRow, {
  VoucherRowData,
} from '@/components/bookkeeping/voucher-row';

import type { Account } from '@/components/bookkeeping/account-select';

import { createClient } from '@/lib/supabase/client';

function createEmptyRow(): VoucherRowData {
  return {
    id: crypto.randomUUID(),
    account: null,
    debit: '',
    credit: '',
  };
}

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function VoucherForm() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [rows, setRows] = useState<VoucherRowData[]>([
    createEmptyRow(),
    createEmptyRow(),
  ]);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [description, setDescription] = useState('');

  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [accountsError, setAccountsError] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    async function loadAccounts() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAccountsError('Ingen användare är inloggad.');

        setLoadingAccounts(false);
        return;
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (companyError || !company) {
        setAccountsError('Kunde inte hitta företaget.');

        setLoadingAccounts(false);
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('id, account_number, name')
        .eq('company_id', company.id)
        .eq('active', true)
        .order('account_number');

      if (error) {
        setAccountsError('Kunde inte hämta kontoplanen.');

        setLoadingAccounts(false);
        return;
      }

      setAccounts(data ?? []);
      setLoadingAccounts(false);
    }

    loadAccounts();
  }, []);

  const debitTotal = useMemo(() => {
    return rows.reduce((total, row) => total + (Number(row.debit) || 0), 0);
  }, [rows]);

  const creditTotal = useMemo(() => {
    return rows.reduce((total, row) => total + (Number(row.credit) || 0), 0);
  }, [rows]);

  const difference = debitTotal - creditTotal;

  const hasValidRows = rows.every((row) => {
    const debit = Number(row.debit) || 0;
    const credit = Number(row.credit) || 0;

    return (
      row.account !== null &&
      (debit > 0 || credit > 0) &&
      !(debit > 0 && credit > 0)
    );
  });

  const isBalanced =
    debitTotal > 0 && creditTotal > 0 && Math.abs(difference) < 0.005;

  const canSubmit =
    description.trim().length > 0 &&
    date.length > 0 &&
    rows.length >= 2 &&
    hasValidRows &&
    isBalanced;

  function handleRowChange(rowId: string, updatedRow: VoucherRowData) {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? updatedRow : row)),
    );
  }

  function handleDeleteRow(rowId: string) {
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
  }

  function handleAddRow() {
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSaving(true);
    setSaveError('');
    setSuccessMessage('');

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaveError('Du är inte längre inloggad.');

      setSaving(false);
      return;
    }

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (companyError || !company) {
      setSaveError('Kunde inte hitta företaget.');

      setSaving(false);
      return;
    }

    const voucherRows = rows.map((row) => ({
      account_id: row.account!.id,
      debit: Number(row.debit) || 0,
      credit: Number(row.credit) || 0,
    }));

    const { data, error } = await supabase.rpc('create_voucher', {
      p_company_id: company.id,
      p_voucher_date: date,
      p_description: description.trim(),
      p_rows: voucherRows,
    });

    if (error) {
      console.error(error);

      setSaveError('Kunde inte bokföra verifikationen.');

      setSaving(false);
      return;
    }

    setSuccessMessage('Verifikationen har bokförts.');

    setDescription('');

    setRows([createEmptyRow(), createEmptyRow()]);

    setSaving(false);

    console.log('Sparad verifikation:', data);
  }

  if (loadingAccounts) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 8,
        }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 1100,
        mx: 'auto',
      }}>
      <Stack spacing={3}>
        <Box>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.4px',
            }}>
            Ny verifikation
          </Typography>

          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            Registrera en ny bokföringshändelse.
          </Typography>
        </Box>

        {accountsError && <Alert severity='error'>{accountsError}</Alert>}

        {successMessage && <Alert severity='success'>{successMessage}</Alert>}

        {saveError && <Alert severity='error'>{saveError}</Alert>}

        <Card
          variant='outlined'
          sx={{
            borderRadius: 1.5,
            borderColor: 'divider',
          }}>
          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },

              '&:last-child': {
                pb: {
                  xs: 2,
                  sm: 2.5,
                },
              },
            }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                mb: 2,
              }}>
              Verifikationsuppgifter
            </Typography>

            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={2}>
              <TextField
                label='Datum'
                type='date'
                value={date}
                onChange={(event) => setDate(event.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                label='Beskrivning'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder='Ex. Försäljning av vara'
                fullWidth
                size='small'
                slotProps={{
                  htmlInput: {
                    maxLength: 200,
                  },
                }}
              />
            </Stack>
          </CardContent>

          <Divider />

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 2.5,
              },

              pt: 2,
              pb: 1,
            }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}>
              Kontering
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 0.25 }}>
              Ange konto och belopp för varje bokföringsrad.
            </Typography>
          </Box>

          {/* MOBIL */}

          <Box
            sx={{
              display: {
                xs: 'block',
                sm: 'none',
              },

              px: 2,
              pb: 1,
            }}>
            <Stack spacing={1.5}>
              {rows.map((row) => (
                <VoucherRow
                  key={row.id}
                  row={row}
                  accounts={accounts}
                  onChange={(updatedRow) => handleRowChange(row.id, updatedRow)}
                  onDelete={() => handleDeleteRow(row.id)}
                  canDelete={rows.length > 2}
                  mobile
                />
              ))}
            </Stack>
          </Box>

          {/* DESKTOP */}

          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Konto</TableCell>

                  <TableCell
                    align='right'
                    sx={{
                      width: 80,
                    }}>
                    Debet
                  </TableCell>

                  <TableCell
                    align='right'
                    sx={{
                      width: 80,
                    }}>
                    Kredit
                  </TableCell>

                  <TableCell
                    sx={{
                      width: 20,
                    }}
                  />
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <VoucherRow
                    key={row.id}
                    row={row}
                    accounts={accounts}
                    onChange={(updatedRow) =>
                      handleRowChange(row.id, updatedRow)
                    }
                    onDelete={() => handleDeleteRow(row.id)}
                    canDelete={rows.length > 2}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 2.5,
              },
              py: 1.5,
            }}>
            <Button
              type='button'
              size='small'
              startIcon={<AddIcon />}
              onClick={handleAddRow}>
              Lägg till rad
            </Button>
          </Box>

          <Divider />

          <Box
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
              },

              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <Stack
              spacing={1}
              sx={{
                width: {
                  xs: '100%',
                  sm: 340,
                },
              }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                <Typography variant='body2' color='text.secondary'>
                  Debet
                </Typography>

                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {formatCurrency(debitTotal)} kr
                </Typography>
              </Stack>

              <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                <Typography variant='body2' color='text.secondary'>
                  Kredit
                </Typography>

                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {formatCurrency(creditTotal)} kr
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction='row'
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}>
                  Differens
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                  color={
                    isBalanced
                      ? 'success.main'
                      : difference !== 0
                        ? 'error.main'
                        : 'text.primary'
                  }>
                  {formatCurrency(difference)} kr
                </Typography>
              </Stack>

              {isBalanced && (
                <Stack
                  direction='row'
                  spacing={0.75}
                  sx={{
                    alignItems: 'center',
                    pt: 0.5,
                    color: 'success.main',
                  }}>
                  <CheckCircleOutlineOutlinedIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                    }}>
                    Verifikationen balanserar
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 2.5,
              },

              py: 2,

              display: 'flex',

              justifyContent: {
                xs: 'stretch',
                sm: 'flex-end',
              },

              bgcolor: '#fafafa',
            }}>
            <Button
              type='submit'
              variant='contained'
              disabled={!canSubmit || saving}
              fullWidth
              sx={{
                minWidth: {
                  sm: 170,
                },

                width: {
                  sm: 'auto',
                },
              }}>
              {saving ? 'Bokför...' : 'Bokför verifikation'}
            </Button>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
