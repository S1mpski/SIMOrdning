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
          p: 6,
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

        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          Dina bokförda verifikationer kommer att visas här.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 120 }}>Ver.nr</TableCell>

            <TableCell sx={{ width: 160 }}>Datum</TableCell>

            <TableCell>Beskrivning</TableCell>

            <TableCell align='right' sx={{ width: 180 }}>
              Belopp
            </TableCell>

            <TableCell sx={{ width: 60 }} />
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

              <TableCell>
                {new Date(
                  `${voucher.voucher_date}T00:00:00`,
                ).toLocaleDateString('sv-SE')}
              </TableCell>

              <TableCell>
                <Typography fontWeight={500}>{voucher.description}</Typography>
              </TableCell>

              <TableCell align='right'>
                {voucher.amount.toLocaleString('sv-SE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                kr
              </TableCell>

              <TableCell align='right'>
                <IconButton size='small' aria-label='Visa verifikation'>
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
