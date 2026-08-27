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
        <CircularProgress />
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
          <Typography variant='h4' fontWeight={700}>
            Ny verifikation
          </Typography>

          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            Registrera en ny bokföringshändelse.
          </Typography>
        </Box>

        {accountsError && <Alert severity='error'>{accountsError}</Alert>}

        <Card variant='outlined'>
          <CardContent>
            <Stack spacing={3}>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 220,
                    },
                  }}
                />

                <TextField
                  label='Beskrivning'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder='Ex. Försäljning av vara'
                  fullWidth
                  inputProps={{
                    maxLength: 200,
                  }}
                />
              </Stack>

              <Divider />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Konto</TableCell>

                    <TableCell sx={{ width: 180 }}>Debet</TableCell>

                    <TableCell sx={{ width: 180 }}>Kredit</TableCell>

                    <TableCell sx={{ width: 60 }} />
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

              <Box>
                <Button
                  type='button'
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}>
                  Lägg till rad
                </Button>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}>
                <Stack
                  spacing={1}
                  sx={{
                    width: 320,
                  }}>
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography color='text.secondary'>Debet</Typography>

                    <Typography fontWeight={600}>
                      {debitTotal.toLocaleString('sv-SE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      kr
                    </Typography>
                  </Stack>

                  <Stack direction='row' justifyContent='space-between'>
                    <Typography color='text.secondary'>Kredit</Typography>

                    <Typography fontWeight={600}>
                      {creditTotal.toLocaleString('sv-SE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      kr
                    </Typography>
                  </Stack>

                  <Stack direction='row' justifyContent='space-between'>
                    <Typography color='text.secondary'>Differens</Typography>

                    <Typography
                      fontWeight={700}
                      color={isBalanced ? 'success.main' : 'error.main'}>
                      {difference.toLocaleString('sv-SE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      kr
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {isBalanced && (
                <Alert
                  severity='success'
                  icon={<CheckCircleOutlineOutlinedIcon />}>
                  Verifikationen balanserar.
                </Alert>
              )}

              {saveError && <Alert severity='error'>{saveError}</Alert>}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  disabled={!canSubmit || saving}>
                  {saving ? 'Bokför...' : 'Bokför verifikation'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
