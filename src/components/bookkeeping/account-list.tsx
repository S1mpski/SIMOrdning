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
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
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

import { useCompany } from '@/components/providers/company-provider';
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

function getAccountTypeLabel(accountType: AccountType | null) {
  switch (accountType) {
    case 'asset':
      return 'Tillgång';

    case 'equity':
      return 'Eget kapital';

    case 'liability':
      return 'Skuld';

    case 'revenue':
      return 'Intäkt';

    case 'expense':
      return 'Kostnad';

    default:
      return '–';
  }
}

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

export default function AccountList({ accounts, companyId }: Props) {
  const router = useRouter();

  const supabase = createClient();

  const company = useCompany();

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
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          minWidth: 0,
        }}>
        {/* KNAPPAR */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            minWidth: 0,
          }}>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1.5}
            sx={{
              width: {
                xs: '100%',
                sm: 'auto',
              },

              '& .MuiButton-root': {
                whiteSpace: 'nowrap',
              },
            }}>
            <Button
              variant='outlined'
              startIcon={<LibraryAddOutlinedIcon />}
              onClick={handleOpenBasDialog}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'auto',
                },
              }}>
              Lägg till från BAS
            </Button>

            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'auto',
                },
              }}>
              Skapa eget konto
            </Button>
          </Stack>
        </Box>

        {/* RUBRIK + SÖK */}
        <Box
          sx={{
            display: 'flex',

            flexDirection: {
              xs: 'column',
              md: 'row',
            },

            alignItems: {
              xs: 'stretch',
              md: 'flex-end',
            },

            justifyContent: 'space-between',

            gap: {
              xs: 2,
              md: 4,
            },

            width: '100%',
            minWidth: 0,
          }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,

                fontSize: {
                  xs: 28,
                  md: 34,
                },
              }}>
              Kontoplan
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mt: 0.5,
                overflowWrap: 'anywhere',
              }}>
              Bokföringskonton som finns tillgängliga i{' '}
              {company?.name ?? 'företaget'}.
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
                md: 300,
                lg: 360,
              },
              flexShrink: 0,
            }}
          />
        </Box>

        {accounts.length === 0 ? (
          <Paper
            variant='outlined'
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}>
            <Typography color='text.secondary'>
              Det finns inga konton i kontoplanen.
            </Typography>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            variant='outlined'
            sx={{
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              overflowX: 'auto',
            }}>
            <Table
              sx={{
                width: '100%',
                minWidth: 640,
                tableLayout: 'fixed',

                '& .MuiTableCell-root': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',

                  px: {
                    xs: 1.25,
                    md: 2,
                  },

                  py: {
                    xs: 1.25,
                    md: 1.5,
                  },
                },
              }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 120,
                      whiteSpace: 'nowrap',
                    }}>
                    Kontonummer
                  </TableCell>

                  <TableCell>Kontonamn</TableCell>

                  <TableCell
                    sx={{
                      width: 130,
                      whiteSpace: 'nowrap',
                    }}>
                    Kontotyp
                  </TableCell>

                  <TableCell
                    align='right'
                    sx={{
                      width: 105,
                    }}>
                    Status
                  </TableCell>

                  <TableCell
                    align='right'
                    sx={{
                      width: 52,
                    }}
                  />
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow
                    key={account.id}
                    hover
                    sx={{
                      opacity: account.active ? 1 : 0.6,

                      '&:last-child td': {
                        borderBottom: 0,
                      },
                    }}>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                        {account.account_number}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        minWidth: 0,
                      }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          minWidth: 0,

                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {account.name}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',
                      }}>
                      {getAccountTypeLabel(account.account_type)}
                    </TableCell>

                    <TableCell align='right'>
                      <Chip
                        size='small'
                        label={account.active ? 'Aktivt' : 'Inaktivt'}
                        color={account.active ? 'success' : 'default'}
                        variant='outlined'
                      />
                    </TableCell>

                    <TableCell
                      align='right'
                      sx={{
                        px: {
                          xs: 0.5,
                          md: 1,
                        },
                      }}>
                      <IconButton
                        size='small'
                        aria-label='Kontoalternativ'
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

      {/* KONTO-MENY */}
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
          <EditOutlinedIcon
            fontSize='small'
            sx={{
              mr: 1.5,
            }}
          />
          Redigera
        </MenuItem>

        <MenuItem onClick={handleToggleActive}>
          {selectedAccount?.active ? (
            <ToggleOffOutlinedIcon
              fontSize='small'
              sx={{
                mr: 1.5,
              }}
            />
          ) : (
            <ToggleOnOutlinedIcon
              fontSize='small'
              sx={{
                mr: 1.5,
              }}
            />
          )}

          {selectedAccount?.active ? 'Inaktivera' : 'Aktivera'}
        </MenuItem>
      </Menu>

      {/* BAS-DIALOG */}
      <Dialog
        open={basDialogOpen}
        onClose={handleCloseBasDialog}
        fullWidth
        maxWidth='md'
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: 'calc(100% - 24px)',
                sm: 'calc(100% - 64px)',
              },
              m: {
                xs: 1.5,
                sm: 4,
              },
            },
          },
        }}>
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

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: 0.75,
              }}>
              <Typography
                variant='h6'
                color='text.secondary'
                sx={{
                  fontWeight: 500,
                }}>
                {availableBasAccounts.length}
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Konton finns tillgängliga att lägga till.
              </Typography>
            </Box>

            <Box
              sx={{
                maxHeight: {
                  xs: 420,
                  sm: 480,
                },

                overflowY: 'auto',

                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}>
              {filteredBasAccounts.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                  }}>
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

                  return (
                    <Box
                      key={account.accountNumber}
                      onClick={() =>
                        handleToggleBasAccount(account.accountNumber)
                      }
                      sx={{
                        display: 'grid',

                        gridTemplateColumns: {
                          xs: '36px 60px minmax(0, 1fr)',
                          sm: '40px 76px minmax(0, 1fr) auto',
                        },

                        alignItems: 'center',

                        columnGap: {
                          xs: 0.5,
                          sm: 1,
                        },

                        rowGap: 0.5,

                        px: {
                          xs: 1,
                          sm: 1.5,
                        },

                        py: {
                          xs: 1,
                          sm: 0.75,
                        },

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
                        sx={{
                          p: 0.5,
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          whiteSpace: 'nowrap',
                        }}>
                        {account.accountNumber}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 14,
                          minWidth: 0,

                          overflow: {
                            xs: 'visible',
                            sm: 'hidden',
                          },

                          textOverflow: {
                            sm: 'ellipsis',
                          },

                          whiteSpace: {
                            xs: 'normal',
                            sm: 'nowrap',
                          },

                          overflowWrap: 'anywhere',
                        }}>
                        {account.name}
                      </Typography>

                      <Chip
                        label={typeChip.label}
                        color={typeChip.color}
                        size='small'
                        variant='outlined'
                        sx={{
                          gridColumn: {
                            xs: '3',
                            sm: 'auto',
                          },

                          justifySelf: {
                            xs: 'start',
                            sm: 'end',
                          },

                          mt: {
                            xs: 0.25,
                            sm: 0,
                          },

                          flexShrink: 0,
                        }}
                      />
                    </Box>
                  );
                })
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            flexWrap: 'wrap',
            gap: 1,

            px: {
              xs: 2,
              sm: 3,
            },

            py: 1.5,
          }}>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mr: 'auto',
            }}>
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

      {/* SKAPA / REDIGERA KONTO */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth='sm'
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: 'calc(100% - 24px)',
                sm: 'calc(100% - 64px)',
              },

              m: {
                xs: 1.5,
                sm: 4,
              },
            },
          },
        }}>
        <DialogTitle>
          {editingAccount ? 'Redigera konto' : 'Lägg till konto'}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              mt: 1,
            }}>
            {error && <Alert severity='error'>{error}</Alert>}

            <TextField
              label='Kontonummer'
              type='text'
              value={form.accountNumber}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  accountNumber: event.target.value.replace(/\D/g, ''),
                }))
              }
              fullWidth
              size='small'
              autoFocus={!editingAccount}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
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

        <DialogActions
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },

            py: 1.5,
          }}>
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
