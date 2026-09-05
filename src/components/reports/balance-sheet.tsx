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

  const gridColumns = {
    xs: '120px minmax(220px, 1fr) 150px',
    sm: '140px minmax(260px, 1fr) 170px',
    lg: '160px minmax(320px, 1fr) 180px',
  };

  const namePadding = {
    xs: 4,
    sm: 8,
    lg: 16,
  };

  const totalFontSize = {
    xs: 18,
    md: 22,
  };

  const totalTextSx = {
    fontSize: totalFontSize,
    fontWeight: 700,

    '@media print': {
      fontSize: 16,
    },
  };

  return (
    <Box
      id='print-balance-report'
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 1800,
        mx: 'auto',

        px: {
          xs: 2,
          sm: 2,
          md: 3,
          lg: 4,
        },
      }}>
      <Stack spacing={2}>
        {/* HEADER */}
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
            Balansrapport
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mt: 0.5,
              overflowWrap: 'anywhere',
            }}>
            {company?.name ?? 'företaget'}
            {'s'} tillgångar, eget kapital och skulder.
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
                xs: 1.5,
                sm: 2,
                md: 2.5,
              },

              '&:last-child': {
                pb: {
                  xs: 1.5,
                  sm: 2,
                  md: 2.5,
                },
              },
            }}>
            <Box
              className='report-scroll'
              sx={{
                width: '100%',
                minWidth: 0,
                overflowX: 'auto',

                '@media print': {
                  overflow: 'visible',
                },
              }}>
              <Stack
                className='report-content'
                spacing={3}
                sx={{
                  minWidth: {
                    xs: 560,
                    sm: 620,
                    lg: 0,
                  },

                  '@media print': {
                    minWidth: 0,
                    width: '100%',
                  },
                }}>
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
                        pl: namePadding,
                      }}>
                      Kontonamn
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}>
                      Tillgångar
                    </Typography>
                  </Box>

                  <Divider />

                  {assetAccounts.map((account) => {
                    const amount = account.debit - account.credit;

                    return (
                      <Box key={account.account_number} className='report-row'>
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
                            className='report-account-name'
                            sx={{
                              pl: namePadding,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',

                              '@media print': {
                                pl: 4,
                                overflow: 'visible',
                                textOverflow: 'clip',
                                whiteSpace: 'normal',
                              },
                            }}>
                            {account.name}
                          </Typography>

                          <Typography
                            sx={{
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}>
                            {formatCurrency(amount)} kr
                          </Typography>
                        </Box>

                        <Divider />
                      </Box>
                    );
                  })}

                  {/* SUMMA TILLGÅNGAR */}
                  <Box
                    className='report-total'
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
                      <Typography sx={totalTextSx}>
                        Summa tillgångar :
                      </Typography>

                      <Typography sx={totalTextSx}>
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
                        pl: namePadding,
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
                      <Box key={account.account_number} className='report-row'>
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
                            className='report-account-name'
                            sx={{
                              pl: namePadding,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',

                              '@media print': {
                                pl: 4,
                                overflow: 'visible',
                                textOverflow: 'clip',
                                whiteSpace: 'normal',
                              },
                            }}>
                            {account.name}
                          </Typography>

                          <Typography
                            sx={{
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}>
                            {formatCurrency(amount)} kr
                          </Typography>
                        </Box>

                        <Divider />
                      </Box>
                    );
                  })}

                  {/* SUMMA EGET KAPITAL OCH SKULDER */}
                  <Box
                    className='report-total'
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
                      <Typography sx={totalTextSx}>
                        Summa eget kapital och skulder :
                      </Typography>

                      <Typography sx={totalTextSx}>
                        {formatCurrency(totalEquityAndLiabilities)} kr
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
