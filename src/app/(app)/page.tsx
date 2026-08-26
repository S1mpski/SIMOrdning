import { redirect } from 'next/navigation';

import LogoutButton from '@/components/auth/logout-button';
import CompanyNameForm from '@/components/company/company-name-form';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: company, error } = await supabase
    .from('companies')
    .select('id, name, created_at')
    .eq('owner_id', user.id)
    .single();

  if (error || !company) {
    return <main>Kunde inte hitta ditt företag.</main>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>SIMOrdning</h1>

      <h2>{company.name}</h2>

      <p>Välkommen till ditt bokföringsprogram.</p>

      <CompanyNameForm companyId={company.id} initialName={company.name} />

      <LogoutButton />
    </main>
  );
}
