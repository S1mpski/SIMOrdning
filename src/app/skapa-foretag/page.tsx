import { redirect } from 'next/navigation';

import AcceptCompanyInvitation from '@/components/company/accept-company-invitation';
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

  const { data: invitation } = await supabase
    .from('company_invitations')
    .select(
      `
      id,
      email,
      role,
      expires_at,
      companies (
        id,
        name
      )
    `,
    )
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (invitation) {
    return <AcceptCompanyInvitation invitation={invitation} />;
  }

  return <CreateCompanyForm />;
}
