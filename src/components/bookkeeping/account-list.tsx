'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import { Divider } from '@mui/material';

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';

export type AccountListItem = {
  id: string;
  account_number: number;
  name: string;
  active: boolean;
};

type Props = {
  accounts: AccountListItem[];
  companyId: string;
};

type AccountForm = {
  accountNumber: string;
  name: string;
};

const emptyForm: AccountForm = {
  accountNumber: '',
  name: '',
};

export default function AccountList({ accounts, companyId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountListItem | null>(
    null,
  );

  const [form, setForm] = useState<AccountForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const [selectedAccount, setSelectedAccount] =
    useState<AccountListItem | null>(null);

  function handleOpenCreate() {
    setEditingAccount(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  }

  function handleOpenEdit(account: AccountListItem) {
    setEditingAccount(account);

    setForm({
      accountNumber: String(account.account_number),
      name: account.name,
    });

    setError('');
    setMenuAnchor(null);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setEditingAccount(null);
    setForm(emptyForm);
    setError('');
  }

  function handleOpenMenu(
    event: React.MouseEvent<HTMLElement>,
    account: AccountListItem,
  ) {
    setMenuAnchor(event.currentTarget);
    setSelectedAccount(account);
  }

  function handleCloseMenu() {
    setMenuAnchor(null);
    setSelectedAccount(null);
  }

  async function handleSave() {
    setError('');

    const parsedAccountNumber = Number(form.accountNumber);

    if (!form.accountNumber.trim()) {
      setError('Ange ett kontonummer.');
      return;
    }

    if (
      !Number.isInteger(parsedAccountNumber) ||
      parsedAccountNumber < 1000 ||
      parsedAccountNumber > 9999
    ) {
      setError('Kontonumret måste vara ett heltal mellan 1000 och 9999.');
      return;
    }

    if (!form.name.trim()) {
      setError('Ange ett kontonamn.');
      return;
    }

    const duplicate = accounts.some(
      (account) =>
        account.account_number === parsedAccountNumber &&
        account.id !== editingAccount?.id,
    );

    if (duplicate) {
      setError(`Konto ${parsedAccountNumber} finns redan.`);
      return;
    }

    setSaving(true);

    if (editingAccount) {
      const { error: updateError } = await supabase
        .from('accounts')
        .update({
          account_number: parsedAccountNumber,
          name: form.name.trim(),
        })
        .eq('id', editingAccount.id)
        .eq('company_id', companyId);

      setSaving(false);

      if (updateError) {
        if (updateError.code === '23505') {
          setError(`Konto ${parsedAccountNumber} finns redan.`);
          return;
        }

        setError(updateError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('accounts').insert({
        company_id: companyId,
        account_number: parsedAccountNumber,
        name: form.name.trim(),
        active: true,
      });

      setSaving(false);

      if (insertError) {
        if (insertError.code === '23505') {
          setError(`Konto ${parsedAccountNumber} finns redan.`);
          return;
        }

        setError(insertError.message);
        return;
      }
    }

    setDialogOpen(false);
    setEditingAccount(null);
    setForm(emptyForm);

    router.refresh();
  }

  async function handleToggleActive() {
    if (!selectedAccount) {
      return;
    }

    const account = selectedAccount;

    handleCloseMenu();

    const { error: updateError } = await supabase
      .from('accounts')
      .update({
        active: !account.active,
      })
      .eq('id', account.id)
      .eq('company_id', companyId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}>
          <Box>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,
              }}>
              Kontoplan
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mt: 0.5,
              }}>
              Konton som används i företagets bokföring.
            </Typography>
          </Box>

          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              flexShrink: 0,
            }}>
            Lägg till konto
          </Button>
        </Box>

        {error && (
          <Alert severity='error' onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {accounts.length === 0 ? (
          <Paper variant='outlined' sx={{ p: 4 }}>
            <Typography color='text.secondary'>
              Det finns inga konton i kontoplanen.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} variant='outlined'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 160 }}>Kontonummer</TableCell>

                  <TableCell>Kontonamn</TableCell>

                  <TableCell align='right' sx={{ width: 140 }}>
                    Status
                  </TableCell>

                  <TableCell align='right' sx={{ width: 70 }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {accounts.map((account) => (
                  <TableRow
                    key={account.id}
                    hover
                    sx={{
                      opacity: account.active ? 1 : 0.6,

                      '& td': {
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      },
                    }}>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}>
                        {account.account_number}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      {account.name}{' '}
                    </TableCell>

                    <TableCell align='right'>
                      <Chip
                        size='small'
                        label={account.active ? 'Aktivt' : 'Inaktivt'}
                        color={account.active ? 'success' : 'default'}
                        variant='outlined'
                      />
                    </TableCell>

                    <TableCell align='right'>
                      <IconButton
                        size='small'
                        onClick={(event) => handleOpenMenu(event, account)}>
                        <MoreVertIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            if (selectedAccount) {
              handleOpenEdit(selectedAccount);
            }
          }}>
          <EditOutlinedIcon fontSize='small' sx={{ mr: 1.5 }} />
          Redigera
        </MenuItem>

        <MenuItem onClick={handleToggleActive}>
          {selectedAccount?.active ? (
            <ToggleOffOutlinedIcon fontSize='small' sx={{ mr: 1.5 }} />
          ) : (
            <ToggleOnOutlinedIcon fontSize='small' sx={{ mr: 1.5 }} />
          )}

          {selectedAccount?.active ? 'Inaktivera' : 'Aktivera'}
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>
          {editingAccount ? 'Redigera konto' : 'Lägg till konto'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity='error'>{error}</Alert>}

            <TextField
              label='Kontonummer'
              type='number'
              value={form.accountNumber}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  accountNumber: event.target.value,
                }))
              }
              fullWidth
              size='small'
              autoFocus={!editingAccount}
              slotProps={{
                htmlInput: {
                  min: 1000,
                  max: 9999,
                },
              }}
            />

            <TextField
              label='Kontonamn'
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              fullWidth
              size='small'
              placeholder='Exempel: Sparkonto'
              autoFocus={Boolean(editingAccount)}
            />

            {!editingAccount && (
              <Typography variant='caption' color='text.secondary'>
                Kontot blir aktivt direkt och kan användas i nya verifikationer.
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Avbryt
          </Button>

          <Button variant='contained' onClick={handleSave} disabled={saving}>
            {saving
              ? 'Sparar...'
              : editingAccount
                ? 'Spara ändringar'
                : 'Lägg till'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
