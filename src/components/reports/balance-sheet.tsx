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

const company = useCompany();

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function BalanceSheet({ accounts }: Props) {
  const assetAccounts = accounts.filter(
    (account) =>
      account.account_number >= 1000 && account.account_number < 2000,
  );

  const liabilityAccounts = accounts.filter(
    (account) =>
      account.account_number >= 2000 && account.account_number < 3000,
  );

  const totalAssets = assetAccounts.reduce(
    (total, account) => total + account.debit - account.credit,
    0,
  );

  const totalLiabilities = liabilityAccounts.reduce(
    (total, account) => total + account.credit - account.debit,
    0,
  );

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
              <Stack spacing={1}>
                <Typography variant='h6'>Tillgångar</Typography>

                {assetAccounts.map((account) => {
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
                    Summa tillgångar
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}>
                    {formatCurrency(totalAssets)} kr
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography variant='h6'>Eget kapital och skulder</Typography>

                {liabilityAccounts.map((account) => {
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
                    Summa eget kapital och skulder
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}>
                    {formatCurrency(totalLiabilities)} kr
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
