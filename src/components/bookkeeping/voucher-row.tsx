'use client';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import {
  Box,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  TextField,
  Typography,
} from '@mui/material';

import AccountSelect, {
  Account,
} from '@/components/bookkeeping/account-select';

export type VoucherRowData = {
  id: string;
  account: Account | null;
  debit: string;
  credit: string;
};

type Props = {
  row: VoucherRowData;
  accounts: Account[];
  onChange: (row: VoucherRowData) => void;
  onDelete: () => void;
  canDelete: boolean;
  mobile?: boolean;
};

export default function VoucherRow({
  row,
  accounts,
  onChange,
  onDelete,
  canDelete,
  mobile = false,
}: Props) {
  const debitField = (
    <TextField
      size='small'
      type='number'
      value={row.debit}
      onChange={(event) =>
        onChange({
          ...row,
          debit: event.target.value,
          credit: Number(event.target.value) > 0 ? '' : row.credit,
        })
      }
      placeholder='0,00'
      slotProps={{
        htmlInput: {
          min: 0,
          step: '1',
        },
      }}
      sx={{
        width: mobile ? '100%' : 120,
        minWidth: 0,

        '& input': {
          textAlign: 'right',

          fontSize: {
            xs: 14,
            md: 16,
          },

          px: 1,
        },
      }}
    />
  );

  const creditField = (
    <TextField
      size='small'
      type='number'
      value={row.credit}
      onChange={(event) =>
        onChange({
          ...row,
          credit: event.target.value,
          debit: Number(event.target.value) > 0 ? '' : row.debit,
        })
      }
      placeholder='0,00'
      slotProps={{
        htmlInput: {
          min: 0,
          step: '1',
        },
      }}
      sx={{
        width: mobile ? '100%' : 120,
        minWidth: 0,

        '& input': {
          textAlign: 'right',

          fontSize: {
            xs: 14,
            md: 16,
          },

          px: 1,
        },
      }}
    />
  );

  const deleteButton = (
    <Tooltip
      title={
        canDelete
          ? 'Ta bort rad'
          : 'Verifikationen måste innehålla minst 2 rader'
      }
      arrow>
      <span>
        <IconButton
          onClick={onDelete}
          disabled={!canDelete}
          aria-label='Ta bort rad'
          size='small'
          sx={{
            color: 'text.secondary',

            p: {
              xs: 0.5,
              md: 1,
            },

            '&:hover': {
              color: 'error.main',
              bgcolor: 'rgba(211, 47, 47, 0.06)',
            },
          }}>
          <DeleteOutlineOutlinedIcon
            sx={{
              fontSize: {
                xs: 20,
                md: 24,
              },
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  );

  /*
   * SMAL / TABLET
   */
  if (mobile) {
    return (
      <Box
        sx={{
          width: '100%',
          minWidth: 0,

          p: {
            xs: 1.25,
            sm: 1.5,
          },

          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.paper',
        }}>
        <Stack spacing={1.5}>
          {/* KONTO */}
          <Box
            sx={{
              width: '100%',
              minWidth: 0,
            }}>
            <AccountSelect
              accounts={accounts}
              value={row.account}
              onChange={(account) =>
                onChange({
                  ...row,
                  account,
                })
              }
            />
          </Box>

          {/* DEBET / KREDIT / DELETE */}
          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: {
                xs: 'minmax(0, 1fr) minmax(0, 1fr) auto',
              },

              gap: 1,

              width: '100%',
              minWidth: 0,

              alignItems: 'end',
            }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{
                  display: 'block',
                  mb: 0.5,
                }}>
                Debet
              </Typography>

              {debitField}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{
                  display: 'block',
                  mb: 0.5,
                }}>
                Kredit
              </Typography>

              {creditField}
            </Box>

            <Box
              sx={{
                pb: 0.25,
              }}>
              {deleteButton}
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  }

  /*
   * DESKTOP
   */
  return (
    <TableRow
      sx={{
        '& td': {
          py: 1,
        },
      }}>
      <TableCell
        sx={{
          width: '100%',
          minWidth: 260,
          pr: 1,
        }}>
        <Box
          sx={{
            width: '100%',
            minWidth: 0,
          }}>
          <AccountSelect
            accounts={accounts}
            value={row.account}
            onChange={(account) =>
              onChange({
                ...row,
                account,
              })
            }
          />
        </Box>
      </TableCell>

      <TableCell
        sx={{
          width: 140,
          minWidth: 140,
          px: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}>
          {debitField}
        </Box>
      </TableCell>

      <TableCell
        sx={{
          width: 140,
          minWidth: 140,
          px: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}>
          {creditField}
        </Box>
      </TableCell>

      <TableCell
        sx={{
          width: 60,
          minWidth: 60,
          px: 0.5,
          textAlign: 'center',
        }}>
        {deleteButton}
      </TableCell>
    </TableRow>
  );
}
