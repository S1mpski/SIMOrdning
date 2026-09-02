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
        width: {
          xs: 90,
          sm: 120,
        },

        '& input': {
          textAlign: 'center',
          fontSize: {
            xs: 12,
            sm: 14,
          },
          px: 0.75,
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
        width: {
          xs: 90,
          sm: 120,
        },

        '& input': {
          textAlign: 'center',
          fontSize: {
            xs: 14,
            sm: 16,
          },
          px: 0.75,
        },
      }}
    />
  );

  const deleteButton = (
    <Tooltip
      title={
        canDelete
          ? 'Ta bort rad'
          : 'Måste innehålla minst 3 verifieringa innan du kan ta bort'
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
              sm: 1,
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
                sm: 24,
              },
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  );

  if (mobile) {
    return (
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          p: 1.25,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.paper',
        }}>
        <Stack spacing={1.25}>
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

          <Stack
            direction='row'
            spacing={1}
            sx={{
              width: '100%',
              alignItems: 'flex-end',
            }}>
            <Box>
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

            <Box>
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
                ml: 'auto',
              }}>
              {deleteButton}
            </Box>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <TableRow
      sx={{
        '& td': {
          py: 1,
        },
      }}>
      <TableCell
        sx={{
          width: '48%',
          minWidth: 240,
          pr: 1,
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
      </TableCell>

      <TableCell
        sx={{
          width: 140,
          px: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}>
          {debitField}
        </Box>
      </TableCell>

      <TableCell
        sx={{
          width: 140,
          px: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}>
          {creditField}
        </Box>
      </TableCell>

      <TableCell
        sx={{
          width: 70,
          px: 1,
          textAlign: 'center',
        }}>
        {deleteButton}
      </TableCell>
    </TableRow>
  );
}
