import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

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
    <Card variant='outlined'>
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' fontWeight={700}>
              Resultatrapport
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Företagets intäkter och kostnader.
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={1}>
            <Typography variant='h6'>Intäkter</Typography>

            {revenueAccounts.map((account) => {
              const amount = account.credit - account.debit;

              return (
                <Stack
                  key={account.account_number}
                  direction='row'
                  justifyContent='space-between'>
                  <Typography>
                    {account.account_number} – {account.name}
                  </Typography>

                  <Typography>{formatCurrency(amount)} kr</Typography>
                </Stack>
              );
            })}

            <Stack
              direction='row'
              justifyContent='space-between'
              sx={{ pt: 1 }}>
              <Typography fontWeight={700}>Summa intäkter</Typography>

              <Typography fontWeight={700}>
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
                  justifyContent='space-between'>
                  <Typography>
                    {account.account_number} – {account.name}
                  </Typography>

                  <Typography>{formatCurrency(amount)} kr</Typography>
                </Stack>
              );
            })}

            <Stack
              direction='row'
              justifyContent='space-between'
              sx={{ pt: 1 }}>
              <Typography fontWeight={700}>Summa kostnader: </Typography>

              <Typography fontWeight={700}>
                {formatCurrency(totalExpenses)} kr
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h6' fontWeight={700}>
              Resultat:
            </Typography>

            <Typography
              variant='h6'
              fontWeight={700}
              color={result >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(result)} kr
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
