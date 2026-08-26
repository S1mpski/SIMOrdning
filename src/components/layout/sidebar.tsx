import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        padding: 24,
        background: '#202226',
        color: 'white',
      }}>
      <h2>SIMOrdning</h2>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          marginTop: 30,
        }}>
        <Link href='/' style={{ color: 'white' }}>
          Översikt
        </Link>

        <Link href='/ny-verifikation' style={{ color: 'white' }}>
          Ny verifikation
        </Link>

        <Link href='/verifikationer' style={{ color: 'white' }}>
          Verifikationer
        </Link>

        <Link href='/kontoplan' style={{ color: 'white' }}>
          Kontoplan
        </Link>

        <Link href='/rapporter' style={{ color: 'white' }}>
          Rapporter
        </Link>
      </nav>
    </aside>
  );
}
