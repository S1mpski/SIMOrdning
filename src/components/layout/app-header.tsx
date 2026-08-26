import LogoutButton from '@/components/auth/logout-button';
import CompanyNameForm from '@/components/company/company-name-form';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyId, companyName }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 24,
        marginBottom: 24,
        borderBottom: '1px solid #ddd',
      }}>
      <CompanyNameForm companyId={companyId} initialName={companyName} />

      <LogoutButton />
    </header>
  );
}
