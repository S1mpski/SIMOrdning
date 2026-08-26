import { redirect } from 'next/navigation';

import AppHeader from '@/components/layout/app-header';
import Sidebar from '@/components/layout/sidebar';
import { createClient } from '@/lib/supabase/server';

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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: 32,
        }}>
        <AppHeader companyId={company.id} companyName={company.name} />

        {children}
      </div>
    </div>
  );
}
