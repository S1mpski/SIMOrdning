import Dashboard from '@/components/dashboard/dashboard';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Account = {
  account_number: number;
  name?: string;
  account_type: string | null;
};

function getAccount(accounts: Account[] | Account | null) {
  if (!accounts) {
    return null;
  }

  return Array.isArray(accounts) ? (accounts[0] ?? null) : accounts;
}

export default async function HomePage() {
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
    .limit(1)
    .maybeSingle();

  if (!company) {
    return null;
  }

  const { data: vouchers, error } = await supabase
    .from('vouchers')
    .select(
      `
      id,
      voucher_number,
      voucher_date,
      description,
      voucher_rows (
        debit,
        credit,
        accounts (
          account_number,
          name,
          account_type
        )
      )
    `,
    )
    .eq('company_id', company.id)
    .order('voucher_number', {
      ascending: false,
    });

  if (error) {
    console.error('Dashboard vouchers error:', error);
  }

  const allVouchers = vouchers ?? [];

  let revenue = 0;
  let expenses = 0;

  let fixedAssets = 0;
  let currentAssets = 0;

  let equity = 0;
  let liabilities = 0;

  for (const voucher of allVouchers) {
    for (const row of voucher.voucher_rows) {
      const account = getAccount(row.accounts);

      if (!account) {
        continue;
      }

      const accountNumber = Number(account.account_number);
      const debit = Number(row.debit ?? 0);
      const credit = Number(row.credit ?? 0);

      // Tillgångar
      if (account.account_type === 'asset') {
        const balance = debit - credit;

        if (accountNumber >= 1000 && accountNumber <= 1399) {
          fixedAssets += balance;
        } else if (accountNumber >= 1400 && accountNumber <= 1999) {
          currentAssets += balance;
        }
      }

      // Eget kapital
      if (account.account_type === 'equity') {
        equity += credit - debit;
      }

      // Skulder
      if (account.account_type === 'liability') {
        liabilities += credit - debit;
      }

      // Intäkter
      if (account.account_type === 'revenue') {
        revenue += credit - debit;
      }

      // Kostnader
      if (account.account_type === 'expense') {
        expenses += debit - credit;
      }
    }
  }

  const result = revenue - expenses;
  const assets = fixedAssets + currentAssets;
  const totalEquity = equity + result;

  const recentVouchers = allVouchers.slice(0, 5).map((voucher) => ({
    id: voucher.id,
    voucher_number: voucher.voucher_number,
    voucher_date: voucher.voucher_date,
    description: voucher.description,
    amount: voucher.voucher_rows.reduce(
      (total, row) => total + Number(row.debit ?? 0),
      0,
    ),
  }));

  return (
    <Dashboard
      result={result}
      revenue={revenue}
      expenses={expenses}
      assets={assets}
      fixedAssets={fixedAssets}
      currentAssets={currentAssets}
      equity={totalEquity}
      liabilities={liabilities}
      voucherCount={allVouchers.length}
      vouchers={recentVouchers}
    />
  );
}
