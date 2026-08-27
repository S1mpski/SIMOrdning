'use client';

import { useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

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

type Voucher = {
  id: string;
  voucher_number: number;
  voucher_date: string;
  description: string;
  amount: number;
};

type Props = {
  result: number;
  voucherCount: number;
  vouchers: Voucher[];
};

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Dashboard({ result, voucherCount, vouchers }: Props) {
  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant='h4'>Översikt</Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Översikt över företagets bokföring.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <CardContent>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Resultat
                  </Typography>

                  <Typography variant='h5' fontWeight={700} sx={{ mt: 1 }}>
                    {formatCurrency(result)} kr
                  </Typography>
                </Box>

                <TrendingUpOutlinedIcon color='action' />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <CardContent>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='flex-start'>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Verifikationer
                  </Typography>

                  <Typography variant='h5' fontWeight={700} sx={{ mt: 1 }}>
                    {voucherCount} st
                  </Typography>
                </Box>

                <ReceiptLongOutlinedIcon color='action' />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant='body2' color='text.secondary'>
                Senaste verifikation
              </Typography>

              {vouchers.length > 0 ? (
                <>
                  <Typography variant='h6' sx={{ mt: 1 }}>
                    #{vouchers[0].voucher_number}
                  </Typography>

                  <Typography variant='body2' color='text.secondary' noWrap>
                    {vouchers[0].description}
                  </Typography>
                </>
              ) : (
                <Typography sx={{ mt: 1 }}>Ingen ännu</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant='outlined'>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Box>
              <Typography variant='h6'>Senaste verifikationer</Typography>

              <Typography variant='body2' color='text.secondary'>
                De senast bokförda händelserna.
              </Typography>
            </Box>

            <Button onClick={() => router.push('/verifikationer')}>
              Visa alla
            </Button>
          </Box>

          {vouchers.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}>
              <Typography color='text.secondary'>
                Det finns inga verifikationer ännu.
              </Typography>
            </Box>
          ) : (
            <Table>
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
                    onClick={() => router.push(`/verifikationer/${voucher.id}`)}
                    sx={{ cursor: 'pointer' }}>
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
        </CardContent>
      </Card>

      <Card variant='outlined'>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2 }}>
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
  );
}
