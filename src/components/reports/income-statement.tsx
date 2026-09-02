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
        <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              Resultatrapport
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              {company?.name ?? 'företaget'}
              {'s'} intäkter och kostnader.
            </Typography>
          </Box>
          <PrintReportButton />
        </Stack>
        <Card variant='outlined'>
          <CardContent>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant='h6'>Intäkter</Typography>

                {revenueAccounts.map((account) => {
                  const amount = account.credit - account.debit;

                  return (
                    <Stack
                      key={account.account_number}
                      direction='row'
                      sx={{
                        justifyContent: 'space-between',
                      }}>
                      <Typography>
                        {account.account_number} – {account.name}
                      </Typography>

                      <Typography>{formatCurrency(amount)} kr</Typography>
                    </Stack>
                  );
                })}

                <Stack
                  direction='row'
                  sx={{
                    justifyContent: 'space-between',
                    pt: 1,
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}>
                    Summa intäkter
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}>
                    {formatCurrency(totalRevenue)} kr
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography variant='h6'>Kostnader</Typography>

                {expenseAccounts.map((account) => {
                  const amount = account.debit - account.credit;

                  return (
                    <Stack
                      key={account.account_number}
                      direction='row'
                      sx={{
                        justifyContent: 'space-between',
                      }}>
                      <Typography>
                        {account.account_number} – {account.name}
                      </Typography>

                      <Typography>{formatCurrency(amount)} kr</Typography>
                    </Stack>
                  );
                })}

                <Stack
                  direction='row'
                  sx={{
                    justifyContent: 'space-between',
                    pt: 1,
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}>
                    Summa kostnader
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}>
                    {formatCurrency(totalExpenses)} kr
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack
                direction='row'
                sx={{
                  justifyContent: 'space-between',
                }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                  }}>
                  Resultat:
                </Typography>

                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                  }}
                  color={result >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(result)} kr
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
