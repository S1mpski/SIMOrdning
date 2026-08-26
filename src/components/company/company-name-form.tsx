'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

type Props = {
  companyId: string;
  initialName: string;
};

export default function CompanyNameForm({ companyId, initialName }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage('');

    const supabase = createClient();

    const { error } = await supabase
      .from('companies')
      .update({
        name: name.trim(),
      })
      .eq('id', companyId);

    if (error) {
      setMessage('Kunde inte spara företagsnamnet.');
      setLoading(false);
      return;
    }

    setMessage('Företagsnamnet har sparats.');
    setLoading(false);

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='company-name'>Företagsnamn</label>

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 8,
        }}>
        <input
          id='company-name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          style={{
            padding: 10,
            minWidth: 300,
          }}
        />

        <button type='submit' disabled={loading}>
          {loading ? 'Sparar...' : 'Spara'}
        </button>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}
