import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteVoucherButton from '@/components/bookkeeping/delete-voucher-button';

type VoucherRowDetails = {
  id: string;
  debit: number;
  credit: number;
  accounts: {
    account_number: number;
    name: string;
  };
};

type Props = {
  voucherId: string;
  voucherNumber: number;
  voucherDate: string;
  description: string;
  rows: VoucherRowDetails[];
};

export default function VoucherDetails({
  voucherId,
  voucherNumber,
  voucherDate,
  description,
  rows,
}: Props) {
  const debitTotal = rows.reduce((total, row) => total + Number(row.debit), 0);

  const creditTotal = rows.reduce(
    (total, row) => total + Number(row.credit),
    0,
  );

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
      }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            Verifikation {voucherNumber}
          </Typography>

          <Typography color='text.secondary' sx={{ mt: 0.5 }}>
            {new Date(`${voucherDate}T00:00:00`).toLocaleDateString('sv-SE')}
          </Typography>
        </Box>

        <Card variant='outlined'>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Beskrivning
                </Typography>

                <Typography variant='h6'>{description}</Typography>
              </Box>

              <Divider />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Konto</TableCell>

                    <TableCell align='right'>Debet</TableCell>

                    <TableCell align='right'>Kredit</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>
                          {row.accounts.account_number} – {row.accounts.name}
                        </Typography>
                      </TableCell>

                      <TableCell align='right'>
                        {Number(row.debit) > 0
                          ? `${Number(row.debit).toLocaleString('sv-SE', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} kr`
                          : '–'}
                      </TableCell>

                      <TableCell align='right'>
                        {Number(row.credit) > 0
                          ? `${Number(row.credit).toLocaleString('sv-SE', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} kr`
                          : '–'}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>Summa</Typography>
                    </TableCell>

                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 700 }}>
                        {debitTotal.toLocaleString('sv-SE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        kr
                      </Typography>
                    </TableCell>

                    <TableCell align='right'>
                      <Typography sx={{ fontWeight: 700 }}>
                        {creditTotal.toLocaleString('sv-SE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        kr
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2,
                }}>
                <DeleteVoucherButton voucherId={voucherId} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
