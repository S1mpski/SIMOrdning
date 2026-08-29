'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { Button } from '@mui/material';

import DeleteVoucherDialog from '@/components/bookkeeping/delete-voucher-dialog';
import { createClient } from '@/lib/supabase/client';

type Props = {
  voucherId: string;
};

export default function DeleteVoucherButton({ voucherId }: Props) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', voucherId);

    if (error) {
      console.error(error);
      alert('Kunde inte ta bort verifikationen.');
      setIsDeleting(false);
      return;
    }

    setDeleteDialogOpen(false);

    router.push('/verifikationer');
    router.refresh();
  }

  function handleClose() {
    if (isDeleting) {
      return;
    }

    setDeleteDialogOpen(false);
  }

  return (
    <>
      <Button
        variant='outlined'
        color='error'
        startIcon={<DeleteOutlineOutlinedIcon />}
        onClick={() => setDeleteDialogOpen(true)}>
        Ta bort
      </Button>

      <DeleteVoucherDialog
        open={deleteDialogOpen}
        loading={isDeleting}
        onClose={handleClose}
        onConfirm={handleDelete}
      />
    </>
  );
}
