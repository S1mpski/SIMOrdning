'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { basAccounts } from '@/data/bas-accounts';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';

export type AccountListItem = {
  id: string;
  account_number: number;
  name: string;
  active: boolean;
  account_type: AccountType | null;
};

type Props = {
  accounts: AccountListItem[];
  companyId: string;
};

type AccountType = 'asset' | 'equity' | 'liability' | 'revenue' | 'expense';

type AccountForm = {
  accountNumber: string;
  name: string;
  accountType: AccountType | '';
};

const emptyForm: AccountForm = {
  accountNumber: '',
  name: '',
  accountType: '',
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

  const [basDialogOpen, setBasDialogOpen] = useState(false);
  const [basSearch, setBasSearch] = useState('');
  const [selectedBasAccounts, setSelectedBasAccounts] = useState<number[]>([]);
  const [basSaving, setBasSaving] = useState(false);
  const [basError, setBasError] = useState('');
  const [accountSearch, setAccountSearch] = useState('');

  const existingAccountNumbers = new Set(
    accounts.map((account) => account.account_number),
  );

  function handleOpenBasDialog() {
    setBasSearch('');
    setSelectedBasAccounts([]);
    setBasError('');
    setBasDialogOpen(true);
  }

  function handleCloseBasDialog() {
    if (basSaving) {
      return;
    }

    setBasDialogOpen(false);
    setBasSearch('');
    setSelectedBasAccounts([]);
    setBasError('');
  }

  function handleToggleBasAccount(accountNumber: number) {
    setSelectedBasAccounts((current) =>
      current.includes(accountNumber)
        ? current.filter((number) => number !== accountNumber)
        : [...current, accountNumber],
    );
  }

  async function handleAddBasAccounts() {
    if (selectedBasAccounts.length === 0) {
      return;
    }

    setBasSaving(true);
    setBasError('');

    const accountsToAdd = basAccounts
      .filter((account) => selectedBasAccounts.includes(account.accountNumber))
      .map((account) => ({
        company_id: companyId,
        account_number: account.accountNumber,
        name: account.name,
        account_type: account.accountType,
        is_custom: false,
        active: true,
      }));

    const { error: insertError } = await supabase
      .from('accounts')
      .insert(accountsToAdd);

    setBasSaving(false);

    if (insertError) {
      setBasError(insertError.message);
      return;
    }

    setBasDialogOpen(false);
    setSelectedBasAccounts([]);
    setBasSearch('');

    router.refresh();
  }

  const availableBasAccounts = basAccounts.filter(
    (account) => !existingAccountNumbers.has(account.accountNumber),
  );

  const filteredBasAccounts = availableBasAccounts.filter((account) => {
    const search = basSearch.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      String(account.accountNumber).includes(search) ||
      account.name.toLowerCase().includes(search)
    );
  });

  const filteredAccounts = accounts.filter((account) => {
    const search = accountSearch.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      String(account.account_number).includes(search) ||
      account.name.toLowerCase().includes(search)
    );
  });

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
      accountType: account.account_type ?? '',
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

    if (!form.accountType) {
      setError('Välj en kontotyp.');
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
          account_type: form.accountType,
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
        account_type: form.accountType,
        is_custom: true,
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
        {/* Knappar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
          <Stack direction='row' spacing={1.5}>
            <Button
              variant='outlined'
              startIcon={<LibraryAddOutlinedIcon />}
              onClick={handleOpenBasDialog}
              sx={{ flexShrink: 0 }}>
              Lägg till från BAS
            </Button>

            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ flexShrink: 0 }}>
              Skapa eget konto
            </Button>
          </Stack>
        </Box>

        {/* Kontoplan vänster + sökfält höger */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 2,
          }}>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              Kontoplan
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Konton som används i företagets bokföring.
            </Typography>
          </Box>

          <TextField
            placeholder='Sök på kontonummer eller kontonamn...'
            value={accountSearch}
            onChange={(event) => setAccountSearch(event.target.value)}
            size='small'
            sx={{
              width: {
                xs: '100%',
                sm: 360,
              },
            }}
          />
        </Box>

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
                  <TableCell sx={{ width: 160 }}>Kontotyp</TableCell>
                  <TableCell align='right' sx={{ width: 140 }}>
                    Status
                  </TableCell>
                  <TableCell align='right' sx={{ width: 70 }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAccounts.map((account) => (
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

                    <TableCell>
                      {account.account_type === 'asset'
                        ? 'Tillgång'
                        : account.account_type === 'equity'
                          ? 'Eget kapital'
                          : account.account_type === 'liability'
                            ? 'Skuld'
                            : account.account_type === 'revenue'
                              ? 'Intäkt'
                              : account.account_type === 'expense'
                                ? 'Kostnad'
                                : '–'}
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
        open={basDialogOpen}
        onClose={handleCloseBasDialog}
        fullWidth
        maxWidth='md'>
        <DialogTitle>Lägg till från BAS</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            {basError && <Alert severity='error'>{basError}</Alert>}

            <TextField
              placeholder='Sök på kontonummer eller kontonamn...'
              value={basSearch}
              onChange={(event) => setBasSearch(event.target.value)}
              fullWidth
              size='small'
              autoFocus
            />

            <Typography variant='body2' color='text.secondary'>
              {availableBasAccounts.length} konton finns tillgängliga att lägga
              till.
            </Typography>

            <Box
              sx={{
                maxHeight: 480,
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}>
              {filteredBasAccounts.length === 0 ? (
                <Box sx={{ p: 3 }}>
                  <Typography color='text.secondary'>
                    Inga konton hittades.
                  </Typography>
                </Box>
              ) : (
                filteredBasAccounts.map((account) => {
                  const checked = selectedBasAccounts.includes(
                    account.accountNumber,
                  );
                  const typeChip = getAccountTypeChip(account.accountType);
                  function getAccountTypeChip(accountType: string) {
                    switch (accountType) {
                      case 'asset':
                        return {
                          label: 'Tillgång',
                          color: 'info' as const,
                        };

                      case 'equity':
                        return {
                          label: 'Eget kapital',
                          color: 'secondary' as const,
                        };

                      case 'liability':
                        return {
                          label: 'Skuld',
                          color: 'warning' as const,
                        };

                      case 'revenue':
                        return {
                          label: 'Intäkt',
                          color: 'success' as const,
                        };

                      case 'expense':
                        return {
                          label: 'Kostnad',
                          color: 'error' as const,
                        };

                      default:
                        return {
                          label: 'Okänd',
                          color: 'default' as const,
                        };
                    }
                  }

                  return (
                    <Box
                      key={account.accountNumber}
                      onClick={() =>
                        handleToggleBasAccount(account.accountNumber)
                      }
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.75,
                        cursor: 'pointer',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': {
                          borderBottom: 0,
                        },
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}>
                      <Checkbox
                        checked={checked}
                        onChange={() =>
                          handleToggleBasAccount(account.accountNumber)
                        }
                        onClick={(event) => event.stopPropagation()}
                        size='small'
                      />

                      <Typography
                        sx={{
                          width: 80,
                          flexShrink: 0,
                          fontWeight: 600,
                          fontSize: 14,
                        }}>
                        {account.accountNumber}
                      </Typography>

                      <Typography sx={{ fontSize: 14 }}>
                        {account.name}
                      </Typography>

                      <Chip
                        label={typeChip.label}
                        color={typeChip.color}
                        size='small'
                        variant='outlined'
                        sx={{ ml: 'auto', py: 2 }}
                      />
                    </Box>
                  );
                })
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mr: 'auto', ml: 1 }}>
            {selectedBasAccounts.length === 0
              ? 'Inga konton valda'
              : `${selectedBasAccounts.length} valda`}
          </Typography>

          <Button onClick={handleCloseBasDialog} disabled={basSaving}>
            Avbryt
          </Button>

          <Button
            variant='contained'
            onClick={handleAddBasAccounts}
            disabled={basSaving || selectedBasAccounts.length === 0}>
            {basSaving
              ? 'Lägger till...'
              : `Lägg till${
                  selectedBasAccounts.length > 0
                    ? ` (${selectedBasAccounts.length})`
                    : ''
                }`}
          </Button>
        </DialogActions>
      </Dialog>

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

            <FormControl fullWidth size='small'>
              <InputLabel id='account-type-label'>Kontotyp</InputLabel>

              <Select
                labelId='account-type-label'
                label='Kontotyp'
                value={form.accountType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    accountType: event.target.value as AccountType,
                  }))
                }>
                <MenuItem value='asset'>Tillgång</MenuItem>
                <MenuItem value='equity'>Eget kapital</MenuItem>
                <MenuItem value='liability'>Skuld</MenuItem>
                <MenuItem value='revenue'>Intäkt</MenuItem>
                <MenuItem value='expense'>Kostnad</MenuItem>
              </Select>
            </FormControl>

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
