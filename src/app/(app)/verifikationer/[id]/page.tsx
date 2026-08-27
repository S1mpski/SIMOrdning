import { notFound } from 'next/navigation';

import VoucherDetails from '@/components/bookkeeping/voucher-details';

import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VoucherPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!company) {
    notFound();
  }

  const { data: voucher, error } = await supabase
    .from('vouchers')
    .select(
      `
      id,
      voucher_number,
      voucher_date,
      description,
      voucher_rows (
        id,
        debit,
        credit,
        accounts (
          account_number,
          name
        )
      )
    `,
    )
    .eq('id', id)
    .eq('company_id', company.id)
    .single();

  if (error || !voucher) {
    notFound();
  }

  const rows = voucher.voucher_rows.map((row) => ({
    id: row.id,
    debit: row.debit,
    credit: row.credit,
    accounts: row.accounts?.[0] ?? {
      account_number: 0,
      name: '',
    },
  }));

  return (
    <VoucherDetails
      voucherId={voucher.id}
      voucherNumber={voucher.voucher_number}
      voucherDate={voucher.voucher_date}
      description={voucher.description}
      rows={rows}
    />
  );
}
