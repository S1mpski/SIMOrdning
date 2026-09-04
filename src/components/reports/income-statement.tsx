'use client';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import PrintReportButton from './print-report-button';

import { useCompany } from '@/components/providers/company-provider';

export type ReportAccount = {
  account_number: number;
  name: string;
  debit: number;
  credit: number;
};

type Props = {
  accounts: ReportAccount[];
};

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function IncomeStatement({ accounts }: Props) {
  const company = useCompany();

  const revenueAccounts = accounts.filter(
    (account) =>
      account.account_number >= 3000 && account.account_number < 4000,
  );

  const expenseAccounts = accounts.filter(
    (account) =>
      account.account_number >= 4000 && account.account_number < 8000,
  );

  const totalRevenue = revenueAccounts.reduce(
    (total, account) => total + account.credit - account.debit,
    0,
  );

  const totalExpenses = expenseAccounts.reduce(
    (total, account) => total + account.debit - account.credit,
    0,
  );

  const result = totalRevenue - totalExpenses;

  const gridColumns = '160px 1fr 180px';

  return (
    <Box
      id='print-income-report'
      sx={{
        width: '100%',
        maxWidth: 1800,
        mx: 'auto',
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}>
      <Stack spacing={2}>
        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-between',
          }}>
          <Box>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,
              }}>
              Resultatrapport
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mt: 0.5,
              }}>
              {company?.name ?? 'företaget'}
              {'s'} intäkter och kostnader.
            </Typography>
          </Box>

          <PrintReportButton />
        </Stack>

        <Card variant='outlined'>
          <CardContent>
            <Stack spacing={3}>
              {/* INTÄKTER */}
              <Stack spacing={0}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns,
                    px: 2,
                    py: 1.5,
                    alignItems: 'center',
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      pl: 2,
                    }}>
                    Kontonummer
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      pl: 16,
                    }}>
                    Kontonamn
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                    }}>
                    Intäkter
                  </Typography>
                </Box>

                <Divider />

                {revenueAccounts.map((account) => {
                  const amount = account.credit - account.debit;

                  return (
                    <Box key={account.account_number}>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: gridColumns,
                          px: 2,
                          py: 1.5,
                          alignItems: 'center',
                        }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textAlign: 'center',
                          }}>
                          {account.account_number}
                        </Typography>

                        <Typography
                          sx={{
                            pl: 16,
                          }}>
                          {account.name}
                        </Typography>

                        <Typography
                          sx={{
                            textAlign: 'right',
                          }}>
                          {formatCurrency(amount)} kr
                        </Typography>
                      </Box>

                      <Divider />
                    </Box>
                  );
                })}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns,
                    px: 2,
                    pt: 3,
                    pb: 0.5,
                  }}>
                  <Box
                    sx={{
                      gridColumn: '2 / 4',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'baseline',
                      gap: 1.5,
                      whiteSpace: 'nowrap',
                    }}>
                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                      }}>
                      Summa intäkter :
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                      }}>
                      {formatCurrency(totalRevenue)} kr
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{}} />

              {/* KOSTNADER */}
              <Stack spacing={0}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns,
                    px: 2,
                    py: 1.5,
                    alignItems: 'center',
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: 'center',
                    }}>
                    Kontonummer
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      pl: 16,
                    }}>
                    Kontonamn
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                    }}>
                    Kostnader
                  </Typography>
                </Box>

                <Divider />

                {expenseAccounts.map((account) => {
                  const amount = account.debit - account.credit;

                  return (
                    <Box key={account.account_number}>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: gridColumns,
                          px: 2,
                          py: 1.5,
                          alignItems: 'center',
                        }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textAlign: 'center',
                          }}>
                          {account.account_number}
                        </Typography>

                        <Typography
                          sx={{
                            pl: 16,
                          }}>
                          {account.name}
                        </Typography>

                        <Typography
                          sx={{
                            textAlign: 'right',
                          }}>
                          {formatCurrency(amount)} kr
                        </Typography>
                      </Box>

                      <Divider />
                    </Box>
                  );
                })}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns,
                    px: 2,
                    pt: 3,
                    pb: 0.5,
                  }}>
                  <Box
                    sx={{
                      gridColumn: '2 / 4',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'baseline',
                      gap: 1.5,
                      whiteSpace: 'nowrap',
                    }}>
                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                      }}>
                      Summa kostnader :
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                      }}>
                      {formatCurrency(totalExpenses)} kr
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider />

              {/* RESULTAT */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: gridColumns,
                  px: 2,
                  py: 1.5,
                  alignItems: 'center',
                }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                  }}>
                  Resultat
                </Typography>

                <Box />

                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    textAlign: 'right',
                  }}
                  color={result >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(result)} kr
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
