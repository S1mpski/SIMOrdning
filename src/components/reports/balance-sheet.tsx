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
    xs: '82px minmax(0, 1fr) 112px',
    sm: '95px minmax(0, 1fr) 125px',
    md: '130px minmax(0, 1fr) 160px',
    lg: '160px minmax(0, 1fr) 180px',
  };

  const namePadding = {
    xs: 1,
    sm: 1.5,
    md: 4,
    lg: 8,
  };

  const totalFontSize = {
    xs: 16,
    sm: 18,
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
          xs: 1.5,
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
            width: '100%',
            minWidth: 0,
            overflow: 'hidden',
            borderRadius: 1.5,
          }}>
          <CardContent
            sx={{
              p: {
                xs: 1,
                sm: 1.5,
                md: 2.5,
              },

              '&:last-child': {
                pb: {
                  xs: 1,
                  sm: 1.5,
                  md: 2.5,
                },
              },
            }}>
            <Box
              className='report-scroll'
              sx={{
                width: '100%',
                minWidth: 0,
                overflowX: 'hidden',

                '@media print': {
                  overflow: 'visible',
                },
              }}>
              <Stack
                className='report-content'
                spacing={3}
                sx={{
                  width: '100%',
                  minWidth: 0,

                  '@media print': {
                    width: '100%',
                    minWidth: 0,
                  },
                }}>
                {/* TILLGÅNGAR */}
                <Stack spacing={0}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: gridColumns,

                      px: {
                        xs: 0.75,
                        sm: 1,
                        md: 2,
                      },

                      py: 1.5,
                      alignItems: 'center',
                    }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: 'center',

                        fontSize: {
                          xs: 12,
                          sm: 13,
                          md: 14,
                        },
                      }}>
                      Kontonummer
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        pl: namePadding,

                        fontSize: {
                          xs: 12,
                          sm: 13,
                          md: 14,
                        },
                      }}>
                      Kontonamn
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: 'right',
                        whiteSpace: 'nowrap',

                        fontSize: {
                          xs: 12,
                          sm: 13,
                          md: 14,
                        },
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

                            px: {
                              xs: 0.75,
                              sm: 1,
                              md: 2,
                            },

                            py: 1.5,
                            alignItems: 'center',
                          }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              textAlign: 'center',

                              fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                              },
                            }}>
                            {account.account_number}
                          </Typography>

                          <Typography
                            className='report-account-name'
                            sx={{
                              pl: namePadding,
                              minWidth: 0,

                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',

                              fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                              },

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

                              fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                              },
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

                      px: {
                        xs: 0.75,
                        sm: 1,
                        md: 2,
                      },

                      pt: 2.5,
                      pb: 0.5,
                    }}>
                    <Box
                      sx={{
                        gridColumn: '2 / 4',

                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'baseline',

                        gap: {
                          xs: 0.75,
                          md: 1.5,
                        },

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

                      px: {
                        xs: 0.75,
                        sm: 1,
                        md: 2,
                      },

                      py: 1.5,
                      alignItems: 'center',
                    }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: 'center',

                        fontSize: {
                          xs: 12,
                          sm: 13,
                          md: 14,
                        },
                      }}>
                      Kontonummer
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        pl: namePadding,

                        fontSize: {
                          xs: 12,
                          sm: 13,
                          md: 14,
                        },
                      }}>
                      Kontonamn
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        textAlign: 'right',
                        whiteSpace: 'nowrap',

                        fontSize: {
                          xs: 11,
                          sm: 12,
                          md: 14,
                        },
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

                            px: {
                              xs: 0.75,
                              sm: 1,
                              md: 2,
                            },

                            py: 1.5,
                            alignItems: 'center',
                          }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              textAlign: 'center',

                              fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                              },
                            }}>
                            {account.account_number}
                          </Typography>

                          <Typography
                            className='report-account-name'
                            sx={{
                              pl: namePadding,
                              minWidth: 0,

                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',

                              fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                              },

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

                              fontSize: {
                                xs: 12,
                                sm: 13,
                                md: 14,
                              },
                            }}>
                            {formatCurrency(amount)} kr
                          </Typography>
                        </Box>

                        <Divider />
                      </Box>
                    );
                  })}

                  {/* SUMMA */}
                  <Box
                    className='report-total'
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: gridColumns,

                      px: {
                        xs: 0.75,
                        sm: 1,
                        md: 2,
                      },

                      pt: 2.5,
                      pb: 0.5,
                    }}>
                    <Box
                      sx={{
                        gridColumn: '1 / 4',

                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'baseline',

                        gap: {
                          xs: 0.75,
                          md: 1.5,
                        },

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
