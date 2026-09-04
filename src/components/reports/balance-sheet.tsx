'use client';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import type { ReportAccount } from './income-statement';

import { useCompany } from '@/components/providers/company-provider';

type Props = {
  accounts: ReportAccount[];
};

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function BalanceSheet({ accounts }: Props) {
  const company = useCompany();

  const assetAccounts = accounts.filter(
    (account) =>
      account.account_number >= 1000 && account.account_number < 2000,
  );

  const equityAndLiabilityAccounts = accounts.filter(
    (account) =>
      account.account_number >= 2000 && account.account_number < 3000,
  );

  const totalAssets = assetAccounts.reduce(
    (total, account) => total + account.debit - account.credit,
    0,
  );

  const totalEquityAndLiabilities = equityAndLiabilityAccounts.reduce(
    (total, account) => total + account.credit - account.debit,
    0,
  );

  const gridColumns = '160px 1fr 180px';

  return (
    <Box
      id='print-balance-report'
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
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,
            }}>
            Balansrapport
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mt: 0.5,
            }}>
            {company?.name ?? 'företaget'}
            {'s'} tillgångar, eget kapital och skulder.
          </Typography>
        </Box>

        <Card variant='outlined'>
          <CardContent>
            <Stack spacing={3}>
              {/* TILLGÅNGAR */}
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
                    Tillgångar
                  </Typography>
                </Box>

                <Divider />

                {assetAccounts.map((account) => {
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
                      Summa tillgångar :
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                      }}>
                      {formatCurrency(totalAssets)} kr
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider />

              {/* EGET KAPITAL OCH SKULDER */}
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
                      whiteSpace: 'nowrap',
                    }}>
                    Eget kapital och skulder
                  </Typography>
                </Box>

                <Divider />

                {equityAndLiabilityAccounts.map((account) => {
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
                      Summa eget kapital och skulder :
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 700,
                      }}>
                      {formatCurrency(totalEquityAndLiabilities)} kr
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
