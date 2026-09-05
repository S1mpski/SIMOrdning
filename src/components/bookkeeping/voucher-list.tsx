'use client';

import { useRouter } from 'next/navigation';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export type VoucherListItem = {
  id: string;
  voucher_number: number;
  voucher_date: string;
  description: string;
  amount: number;
};

type Props = {
  vouchers: VoucherListItem[];
};

export default function VoucherList({ vouchers }: Props) {
  const router = useRouter();

  if (vouchers.length === 0) {
    return (
      <Paper
        variant='outlined'
        sx={{
          p: {
            xs: 3,
            sm: 4,
            md: 6,
          },
          textAlign: 'center',
        }}>
        <ReceiptLongOutlinedIcon
          sx={{
            fontSize: 48,
            color: 'text.secondary',
            mb: 2,
          }}
        />

        <Typography variant='h6'>Inga verifikationer ännu</Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            mt: 1,
          }}>
          Dina bokförda verifikationer kommer att visas här.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      variant='outlined'
      sx={{
        width: '100%',
        minWidth: 0,
        overflowX: 'auto',
      }}>
      <Table
        sx={(theme) => ({
          minWidth: 560,

          '& .MuiTableCell-root': {
            borderBottomColor:
              theme.palette.mode === 'light'
                ? 'rgba(31, 41, 55, 0.14)'
                : 'divider',

            px: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },

            py: {
              xs: 1.25,
              sm: 1.5,
            },
          },
        })}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                width: {
                  xs: 80,
                  sm: 100,
                  md: 120,
                },
                whiteSpace: 'nowrap',
              }}>
              Ver.nr
            </TableCell>

            <TableCell
              sx={{
                width: {
                  xs: 105,
                  sm: 120,
                  md: 140,
                },
                whiteSpace: 'nowrap',
              }}>
              Datum
            </TableCell>

            <TableCell>Beskrivning</TableCell>

            <TableCell
              align='right'
              sx={{
                width: {
                  xs: 120,
                  sm: 135,
                  md: 150,
                },
                whiteSpace: 'nowrap',
              }}>
              Belopp
            </TableCell>

            <TableCell
              sx={{
                width: 48,
              }}
            />
          </TableRow>
        </TableHead>

        <TableBody>
          {vouchers.map((voucher) => (
            <TableRow
              key={voucher.id}
              hover
              onClick={() => router.push(`/verifikationer/${voucher.id}`)}
              sx={{
                cursor: 'pointer',

                '&:last-child td': {
                  borderBottom: 0,
                },
              }}>
              <TableCell>
                <Chip
                  label={voucher.voucher_number}
                  size='small'
                  variant='outlined'
                />
              </TableCell>

              <TableCell
                sx={{
                  whiteSpace: 'nowrap',
                }}>
                {new Date(
                  `${voucher.voucher_date}T00:00:00`,
                ).toLocaleDateString('sv-SE')}
              </TableCell>

              <TableCell
                sx={{
                  minWidth: 0,
                  maxWidth: {
                    xs: 150,
                    sm: 220,
                    md: 360,
                  },
                }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {voucher.description}
                </Typography>
              </TableCell>

              <TableCell
                align='right'
                sx={{
                  whiteSpace: 'nowrap',
                }}>
                {voucher.amount.toLocaleString('sv-SE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                kr
              </TableCell>

              <TableCell
                align='right'
                sx={{
                  px: {
                    xs: 0.5,
                    sm: 1,
                  },
                }}>
                <IconButton
                  size='small'
                  aria-label='Visa verifikation'
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/verifikationer/${voucher.id}`);
                  }}>
                  <ChevronRightIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
