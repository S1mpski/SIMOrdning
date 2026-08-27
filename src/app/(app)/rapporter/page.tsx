import { Box, Typography } from '@mui/material';

import IncomeStatement, {
  ReportAccount,
} from '@/components/reports/income-statement';
import BalanceSheet from '@/components/reports/balance-sheet';
import { createClient } from '@/lib/supabase/server';

export default async function ReportsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!company) {
    return <Typography color='error'>Kunde inte hitta företaget.</Typography>;
  }

  const { data: accounts, error } = await supabase
    .from('accounts')
    .select(
      `
      account_number,
      name,
      voucher_rows (
        debit,
        credit,
        vouchers!inner (
          company_id
        )
      )
    `,
    )
    .eq('voucher_rows.vouchers.company_id', company.id)
    .order('account_number');

  if (error) {
    console.error(error);

    return <Typography color='error'>Kunde inte skapa rapporten.</Typography>;
  }

  const reportAccounts: ReportAccount[] = (accounts ?? []).map((account) => ({
    account_number: account.account_number,
    name: account.name,

    debit: account.voucher_rows.reduce(
      (total, row) => total + Number(row.debit),
      0,
    ),

    credit: account.voucher_rows.reduce(
      (total, row) => total + Number(row.credit),
      0,
    ),
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
      <IncomeStatement accounts={reportAccounts} />

      <BalanceSheet accounts={reportAccounts} />
    </Box>
  );
}
