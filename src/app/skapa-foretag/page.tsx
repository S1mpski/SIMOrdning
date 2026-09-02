import { redirect } from 'next/navigation';

import CreateCompanyForm from '@/components/company/create-company-form';
import { createClient } from '@/lib/supabase/server';

export default async function CreateCompanyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (company) {
    redirect('/');
  }

  return <CreateCompanyForm />;
}
