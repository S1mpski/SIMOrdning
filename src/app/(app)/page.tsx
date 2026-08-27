import Dashboard from '@/components/dashboard/dashboard';

import { createClient } from '@/lib/supabase/server';

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
          account_number
        )
      )
    `,
    )
    .eq('company_id', company.id)
    .order('voucher_number', {
      ascending: false,
    });

  const allVouchers = vouchers ?? [];

  const result = allVouchers.reduce((totalResult, voucher) => {
    const voucherResult = voucher.voucher_rows.reduce((total, row) => {
      const accountNumber = (row.accounts as any)?.account_number;

      if (!accountNumber) {
        return total;
      }

      const debit = Number(row.debit);
      const credit = Number(row.credit);

      if (accountNumber >= 3000 && accountNumber < 4000) {
        return total + credit - debit;
      }

      if (accountNumber >= 4000 && accountNumber < 8000) {
        return total - (debit - credit);
      }

      return total;
    }, 0);

    return totalResult + voucherResult;
  }, 0);

  const recentVouchers = allVouchers.slice(0, 5).map((voucher) => ({
    id: voucher.id,
    voucher_number: voucher.voucher_number,
    voucher_date: voucher.voucher_date,
    description: voucher.description,

    amount: voucher.voucher_rows.reduce(
      (total, row) => total + Number(row.debit),
      0,
    ),
  }));

  return (
    <Dashboard
      result={result}
      voucherCount={allVouchers.length}
      vouchers={recentVouchers}
    />
  );
}
