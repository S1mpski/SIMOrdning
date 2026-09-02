import { redirect } from 'next/navigation';

import AppHeader from '@/components/layout/app-header';
import Footer from '@/components/layout/footer';
import Sidebar from '@/components/layout/sidebar';
import { CompanyProvider } from '@/components/providers/company-provider';
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
    .limit(1)
    .maybeSingle();

  if (error) {
    return <main>Kunde inte läsa företagsinformationen.</main>;
  }

  if (!company) {
    redirect('/skapa-foretag');
  }

  return (
    <CompanyProvider company={company}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}>
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <AppHeader companyId={company.id} companyName={company.name} />

          <Box
            component='main'
            sx={{
              flex: 1,
              p: 4,
            }}>
            {children}
          </Box>

          <Footer />
        </Box>
      </Box>
    </CompanyProvider>
  );
}
