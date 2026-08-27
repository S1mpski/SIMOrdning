import Dashboard from '@/components/dashboard/dashboard';

import { createClient } from '@/lib/supabase/server';

function getAccount(
  accounts:
    | { account_number: number; name?: string }[]
    | { account_number: number; name?: string }
    | null,
) {
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
    .eq('owner_id', user.id)
    .single();

  if (!company) {
    return null;
  }

  const { data: vouchers } = await supabase
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
          name
        )
      )
    `,
    )
    .eq('company_id', company.id)
    .order('voucher_number', {
      ascending: false,
    });

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

      /*
       * Tillgångar
       * Tillgångskonton har normalt debetsaldo.
       */
      if (accountNumber >= 1000 && accountNumber <= 1399) {
        fixedAssets += debit - credit;
      }

      if (accountNumber >= 1400 && accountNumber <= 1999) {
        currentAssets += debit - credit;
      }

      /*
       * Eget kapital
       * Har normalt kreditsaldo.
       */
      if (accountNumber >= 2000 && accountNumber <= 2099) {
        equity += credit - debit;
      }

      /*
       * Skulder
       */
      if (accountNumber >= 2100 && accountNumber <= 2999) {
        liabilities += credit - debit;
      }

      /*
       * Intäkter
       */
      if (accountNumber >= 3000 && accountNumber <= 3999) {
        revenue += credit - debit;
      }

      /*
       * Kostnader
       */
      if (accountNumber >= 4000 && accountNumber <= 8999) {
        expenses += debit - credit;
      }
    }
  }

  const result = revenue - expenses;

  const assets = fixedAssets + currentAssets;

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
      equity={equity}
      liabilities={liabilities}
      voucherCount={allVouchers.length}
      vouchers={recentVouchers}
    />
  );
}
