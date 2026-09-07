import { redirect } from 'next/navigation';

import { Box, Typography } from '@mui/material';

import VoucherList, {
  VoucherListItem,
} from '@/components/bookkeeping/voucher-list';

import { createClient } from '@/lib/supabase/server';
import { useCompany } from '@/components/providers/company-provider';
export default async function VouchersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .limit(1)
    .maybeSingle();

  if (!company) {
    return <Typography color='error'>Kunde inte hitta företaget.</Typography>;
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
      credit
      )
      `,
    )
    .eq('company_id', company.id)
    .order('voucher_number', {
      ascending: false,
    });

  if (error) {
    console.error(error);

    return (
      <Typography color='error'>Kunde inte hämta verifikationerna.</Typography>
    );
  }

  const voucherList: VoucherListItem[] = (vouchers ?? []).map((voucher) => {
    const amount = voucher.voucher_rows.reduce(
      (total, row) => total + Number(row.debit),
      0,
    );

    return {
      id: voucher.id,
      voucher_number: voucher.voucher_number,
      voucher_date: voucher.voucher_date,
      description: voucher.description,
      amount,
    };
  });

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1600,
        mx: 'auto',
        px: {
          sm: 1,
          md: 8,
          xl: 12,
        },
      }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant='h4' sx={{ fontWeight: 700 }}>
          Verifikationer
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Alla bokförda verifikationer för {company?.name ?? 'företaget'}
        </Typography>
      </Box>

      <VoucherList vouchers={voucherList} />
    </Box>
  );
}
