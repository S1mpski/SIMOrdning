'use client';

import { useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { useTheme } from '@mui/material/styles';
import SummaryDonut from '@/components/dashboard/summary-donut';
import { useCompany } from '@/components/providers/company-provider';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { white } from 'next/dist/lib/picocolors';

type Voucher = {
  id: string;
  voucher_number: number;
  voucher_date: string;
  description: string;
  amount: number;
};

type Props = {
  result: number;
  revenue: number;
  expenses: number;

  assets: number;
  fixedAssets: number;
  currentAssets: number;

  equity: number;
  liabilities: number;

  voucherCount: number;
  vouchers: Voucher[];
};

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Dashboard({
  result,
  revenue,
  expenses,
  assets,
  fixedAssets,
  currentAssets,
  equity,
  liabilities,
  voucherCount,
  vouchers,
}: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isProfit = result > 0;
  const isLoss = result < 0;
  const hasResultData = revenue !== 0 || expenses !== 0;
  const resultMargin = revenue > 0 ? (result / revenue) * 100 : null;
  const company = useCompany();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 2100,
        mx: 'auto',
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            Översikt
          </Typography>

          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            Överblickande information om {company?.name ?? 'företaget'}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              variant='outlined'
              sx={{
                height: '100%',
                borderColor: 'divider',
                borderRadius: 1.5,
              }}>
              <CardContent
                sx={{
                  p: 2.5,
                  '&:last-child': {
                    pb: 2.5,
                  },
                }}>
                <Stack
                  direction='row'
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                  <Box>
                    <Typography variant='body1' color='text.secondary'>
                      Resultat
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: 24,
                        lineHeight: 1.2,
                        fontWeight: 700,
                        letterSpacing: '-0.4px',
                      }}>
                      {formatCurrency(result)} kr
                    </Typography>
                  </Box>

                  <TrendingUpOutlinedIcon sx={{ fontSize: '50px' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              variant='outlined'
              sx={{
                height: '100%',
                borderColor: 'divider',
                borderRadius: 1.5,
              }}>
              <CardContent
                sx={{
                  p: 2.5,
                  '&:last-child': {
                    pb: 2.5,
                  },
                }}>
                <Stack
                  direction='row'
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Antal verifikationer
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: 24,
                        lineHeight: 1.2,
                        fontWeight: 700,
                        letterSpacing: '-0.4px',
                      }}>
                      {voucherCount} st
                    </Typography>
                  </Box>

                  <ReceiptLongOutlinedIcon sx={{ fontSize: '40px' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              variant='outlined'
              sx={{
                height: '100%',
                borderColor: 'divider',
                borderRadius: 1.5,
              }}>
              <CardContent
                sx={{
                  p: 2.5,
                  '&:last-child': {
                    pb: 2.5,
                  },
                }}>
                <Typography variant='body2' color='text.secondary'>
                  Senaste verifikationen
                </Typography>

                {vouchers.length > 0 ? (
                  <>
                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: 20,
                        lineHeight: 1.2,
                        fontWeight: 700,
                      }}>
                      {vouchers[0].description}
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      noWrap
                      sx={{ mt: 0.5 }}>
                      {vouchers[0].voucher_date}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1 }}>
                    Ingen ännu
                  </Typography>
                )}
                <TrendingUpOutlinedIcon sx={{ fontSize: '50px' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <SummaryDonut
              title='Tillgångar'
              subtitle={`Fördelning av ${company?.name ?? 'företaget'} tillgångar`}
              centerLabel='Tillgångar'
              centerValue={assets}
              data={[
                {
                  id: 'fixed-assets',
                  label: 'Anläggningstillgångar',
                  value: fixedAssets,
                },
                {
                  id: 'current-assets',
                  label: 'Omsättningstillgångar',
                  value: currentAssets,
                },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <SummaryDonut
              title='Eget kapital & skulder'
              subtitle={`Finansiering av ${company?.name ?? 'företaget'} tillgångar`}
              centerLabel='Totalt'
              centerValue={equity + liabilities}
              data={[
                {
                  id: 'equity',
                  label: 'Eget kapital',
                  value: equity,
                },
                {
                  id: 'liabilities',
                  label: 'Skulder',
                  value: liabilities,
                },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <SummaryDonut
              title='Resultat'
              subtitle={
                resultMargin !== null
                  ? `Resultatmarginal ${resultMargin.toLocaleString('sv-SE', {
                      maximumFractionDigits: 1,
                    })} %`
                  : 'Resultatmarginal saknas'
              }
              centerLabel={
                result > 0 ? 'Vinst' : result < 0 ? 'Förlust' : 'Nollresultat'
              }
              centerValue={result}
              hasAccountingData={hasResultData}
              percentageBase={revenue}
              data={
                isProfit
                  ? [
                      {
                        id: 'profit',
                        label: 'Vinst',
                        value: result,
                        color: theme.palette.simBlue.light,
                      },
                      {
                        id: 'expenses',
                        label: 'Kostnader',
                        value: expenses,
                        color: theme.palette.simBlue.dark,
                      },
                    ]
                  : [
                      {
                        id: 'revenue',
                        label: 'Intäkter',
                        value: revenue,
                        color: theme.palette.simBlue.light,
                      },
                      {
                        id: 'expenses',
                        label: 'Kostnader',
                        value: expenses,
                        color: theme.palette.simBlue.dark,
                      },
                      {
                        id: 'loss',
                        label: 'Förlust',
                        value: result,
                        color: theme.palette.error.dark,
                      },
                    ]
              }
            />
          </Grid>
        </Grid>

        <Card
          variant='outlined'
          sx={{
            borderRadius: 1.5,
          }}>
          <Box>
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  Senaste verifikationer
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mt: 0.25 }}>
                  De senast bokförda händelserna.
                </Typography>
              </Box>

              <Button
                size='small'
                onClick={() => router.push('/verifikationer')}>
                Visa alla
              </Button>
            </Box>

            {vouchers.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  textAlign: 'center',
                }}>
                <Typography color='text.secondary'>
                  Det finns inga verifikationer ännu.
                </Typography>
              </Box>
            ) : (
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 100 }}>Nr</TableCell>

                    <TableCell sx={{ width: 160 }}>Datum</TableCell>

                    <TableCell>Beskrivning</TableCell>

                    <TableCell align='right'>Belopp</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow
                      key={voucher.id}
                      hover
                      onClick={() =>
                        router.push(`/verifikationer/${voucher.id}`)
                      }
                      sx={{
                        cursor: 'pointer',
                      }}>
                      <TableCell>
                        <Chip
                          size='small'
                          variant='outlined'
                          label={voucher.voucher_number}
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(
                          `${voucher.voucher_date}T00:00:00`,
                        ).toLocaleDateString('sv-SE')}
                      </TableCell>

                      <TableCell>{voucher.description}</TableCell>

                      <TableCell align='right'>
                        {formatCurrency(voucher.amount)} kr
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Card>

        <Card
          variant='outlined'
          sx={{
            borderRadius: 1.5,
          }}>
          <CardContent
            sx={{
              p: 2.5,
              '&:last-child': {
                pb: 2.5,
              },
            }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                mb: 2,
              }}>
              Snabbåtgärder
            </Typography>

            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}>
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={() => router.push('/ny-verifikation')}>
                Ny verifikation
              </Button>

              <Button
                variant='outlined'
                startIcon={<ListAltOutlinedIcon />}
                onClick={() => router.push('/kontoplan')}>
                Kontoplan
              </Button>

              <Button
                variant='outlined'
                startIcon={<DescriptionOutlinedIcon />}
                onClick={() => router.push('/rapporter')}>
                Rapporter
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
