import { redirect } from 'next/navigation';

import AppHeader from '@/components/layout/app-header';
import Sidebar from '@/components/layout/sidebar';
import { createClient } from '@/lib/supabase/server';

import { Box } from '@mui/material';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: company, error } = await supabase
    .from('companies')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (error || !company) {
    return <main>Kunde inte hitta ditt företag.</main>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}>
      <Sidebar />

      <Box
        component='main'
        sx={{
          flex: 1,
          minWidth: 0,
          p: 3,
        }}>
        <AppHeader companyId={company.id} companyName={company.name} />

        {children}
      </Box>
    </Box>
  );
}
