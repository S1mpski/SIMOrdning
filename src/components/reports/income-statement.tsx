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
      id='print-income-report'
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
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',

            alignItems: {
              xs: 'stretch',
              md: 'flex-start',
            },
          }}>
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
              Resultatrapport
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mt: 0.5,
                overflowWrap: 'anywhere',
              }}>
              {company?.name ?? 'företaget'}
              {'s'} intäkter och kostnader.
            </Typography>
          </Box>

          <PrintReportButton />
        </Stack>

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
                {/* INTÄKTER */}
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
                      Intäkter
                    </Typography>
                  </Box>

                  <Divider />

                  {revenueAccounts.map((account) => {
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

                  {/* SUMMA INTÄKTER */}
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
                      <Typography sx={totalTextSx}>Summa intäkter :</Typography>

                      <Typography sx={totalTextSx}>
                        {formatCurrency(totalRevenue)} kr
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Divider />

                {/* KOSTNADER */}
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
                      Kostnader
                    </Typography>
                  </Box>

                  <Divider />

                  {expenseAccounts.map((account) => {
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

                  {/* SUMMA KOSTNADER */}
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
                        Summa kostnader :
                      </Typography>

                      <Typography sx={totalTextSx}>
                        {formatCurrency(totalExpenses)} kr
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Divider />

                {/* RESULTAT */}
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

                    pt: 1.5,
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
                    <Typography sx={totalTextSx}>Resultat :</Typography>

                    <Typography
                      sx={totalTextSx}
                      color={result >= 0 ? 'success.main' : 'error.main'}>
                      {formatCurrency(result)} kr
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
