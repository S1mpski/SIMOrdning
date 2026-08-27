'use client';

import { useRouter } from 'next/navigation';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Button } from '@mui/material';

import { createClient } from '@/lib/supabase/client';

type Props = {
  voucherId: string;
};

export default function DeleteVoucherButton({ voucherId }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort verifikationen?',
    );

    if (!confirmed) {
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', voucherId);

    if (error) {
      console.error(error);
      alert('Kunde inte ta bort verifikationen.');
      return;
    }

    router.push('/verifikationer');
    router.refresh();
  }

  return (
    <Button
      color='error'
      variant='outlined'
      startIcon={<DeleteOutlineOutlinedIcon />}
      onClick={handleDelete}>
      Ta bort verifikation
    </Button>
  );
}
