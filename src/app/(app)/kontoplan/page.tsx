import { Box, Typography } from '@mui/material';

import AccountList, {
  AccountListItem,
} from '@/components/bookkeeping/account-list';

import { createClient } from '@/lib/supabase/server';

export default async function AccountsPage() {
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
    .select('id, account_number, name, active, account_type')
    .eq('company_id', company.id)
    .order('account_number');

  if (error) {
    console.error(error);

    return <Typography color='error'>Kunde inte hämta kontoplanen.</Typography>;
  }

  const accountList: AccountListItem[] = accounts ?? [];

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: 'auto',
      }}>
      <AccountList accounts={accountList} companyId={company.id} />
    </Box>
  );
}
