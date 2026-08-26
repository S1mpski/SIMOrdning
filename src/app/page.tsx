import { redirect } from 'next/navigation';

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

      <hr />

      <h3>Översikt</h3>

      <p>Här kommer företagets bokföring att visas.</p>
    </main>
  );
}
