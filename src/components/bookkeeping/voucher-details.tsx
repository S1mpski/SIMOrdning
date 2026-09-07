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

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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
        width: '100%',
        minWidth: 0,
        maxWidth: 1000,
        mx: 'auto',

        px: {
          xs: 2,
          sm: 2,
          md: 3,
        },
      }}>
      <Stack
        spacing={{
          xs: 2,
          md: 3,
        }}>
        {/* HEADER */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,

              fontSize: {
                xs: 28,
                sm: 30,
                md: 34,
              },

              overflowWrap: 'anywhere',
            }}>
            Verifikation {voucherNumber}
          </Typography>

          <Typography
            color='text.secondary'
            sx={{
              mt: 0.5,
            }}>
            {new Date(`${voucherDate}T00:00:00`).toLocaleDateString('sv-SE')}
          </Typography>
        </Box>

        <Card
          variant='outlined'
          sx={{
            minWidth: 0,
            overflow: 'hidden',
            borderRadius: 1.5,
          }}>
          <CardContent
            sx={{
              p: {
                xs: 2,
                md: 3,
              },

              '&:last-child': {
                pb: {
                  xs: 2,
                  md: 3,
                },
              },
            }}>
            <Stack
              spacing={{
                xs: 2,
                md: 3,
              }}>
              {/* BESKRIVNING */}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant='caption' color='text.secondary'>
                  Beskrivning
                </Typography>

                <Typography
                  variant='h6'
                  sx={{
                    overflowWrap: 'anywhere',

                    fontSize: {
                      xs: 18,
                      md: 20,
                    },
                  }}>
                  {description}
                </Typography>
              </Box>

              <Divider />

              {/* TABELL */}
              <Box
                sx={{
                  width: '100%',
                  minWidth: 0,
                  overflowX: 'auto',
                }}>
                <Table
                  size='small'
                  sx={{
                    minWidth: 520,

                    '& .MuiTableCell-root': {
                      borderColor: 'text.disabled',

                      px: {
                        xs: 1.5,
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
                          minWidth: 220,
                        }}>
                        Konto
                      </TableCell>

                      <TableCell
                        align='right'
                        sx={{
                          width: 130,
                          whiteSpace: 'nowrap',
                        }}>
                        Debet
                      </TableCell>

                      <TableCell
                        align='right'
                        sx={{
                          width: 130,
                          whiteSpace: 'nowrap',
                        }}>
                        Kredit
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: 500,

                              maxWidth: {
                                xs: 240,
                                sm: 360,
                                md: 'none',
                              },

                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                            {row.accounts.account_number} – {row.accounts.name}
                          </Typography>
                        </TableCell>

                        <TableCell
                          align='right'
                          sx={{
                            whiteSpace: 'nowrap',
                          }}>
                          {Number(row.debit) > 0
                            ? `${formatCurrency(Number(row.debit))} kr`
                            : '–'}
                        </TableCell>

                        <TableCell
                          align='right'
                          sx={{
                            whiteSpace: 'nowrap',
                          }}>
                          {Number(row.credit) > 0
                            ? `${formatCurrency(Number(row.credit))} kr`
                            : '–'}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* SUMMA */}
                    <TableRow>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}>
                          Summa
                        </Typography>
                      </TableCell>

                      <TableCell
                        align='right'
                        sx={{
                          whiteSpace: 'nowrap',
                        }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}>
                          {formatCurrency(debitTotal)} kr
                        </Typography>
                      </TableCell>

                      <TableCell
                        align='right'
                        sx={{
                          whiteSpace: 'nowrap',
                        }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}>
                          {formatCurrency(creditTotal)} kr
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>

              {/* DELETE */}
              <Box
                sx={{
                  display: 'flex',

                  justifyContent: {
                    xs: 'stretch',
                    sm: 'flex-end',
                  },

                  mt: 2,

                  '& > *': {
                    width: {
                      xs: '100%',
                      sm: 'auto',
                    },
                  },
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
