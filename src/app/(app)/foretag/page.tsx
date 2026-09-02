import CompanyMembers from '@/components/company/company-members';
import CompanySettingsForm from '@/components/company/company-settings-form';
import { createClient } from '@/lib/supabase/server';

export default async function CompanyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: company } = await supabase
    .from('companies')
    .select(
      `
      id,
      owner_id,
      name,
      organization_number,
      company_type,
      address,
      postal_code,
      city,
      country,
      email,
      phone,
      website,
      vat_number,
      vat_registered,
      f_tax,
      fiscal_year_start,
      fiscal_year_end,
      default_currency
    `,
    )
    .limit(1)
    .maybeSingle();

  if (!company) {
    return null;
  }

  const isOwner = company.owner_id === user.id;

  const { data: membership } = await supabase
    .from('company_members')
    .select('role')
    .eq('company_id', company.id)
    .eq('user_id', user.id)
    .maybeSingle();

  const currentRole = isOwner ? 'owner' : (membership?.role ?? 'member');

  const canEditCompany =
    currentRole === 'owner' ||
    currentRole === 'co_owner' ||
    currentRole === 'ceo';

  const canManageMembers =
    currentRole === 'owner' || currentRole === 'co_owner';

  const { data: members } = await supabase
    .from('company_members')
    .select(
      `
      id,
      company_id,
      user_id,
      name,
      email,
      phone,
      role,
      created_at
    `,
    )
    .eq('company_id', company.id)
    .order('created_at', {
      ascending: true,
    });

  return (
    <>
      <CompanySettingsForm company={company} canEdit={canEditCompany} />

      <CompanyMembers
        companyId={company.id}
        initialMembers={members ?? []}
        canManage={canManageMembers}
      />
    </>
  );
}
