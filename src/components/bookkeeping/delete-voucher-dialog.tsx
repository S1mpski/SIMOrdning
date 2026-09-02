'use client';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

type Props = {
  open: boolean;
  loading?: boolean;
  voucherNumber?: number;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteVoucherDialog({
  open,
  loading = false,
  voucherNumber,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth='xs'
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction='row'
          sx={{
            gap: 1.5,
            alignItems: 'center',
          }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
            }}>
            Ta bort verifikation
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography color='text.secondary'>
          Är du säker på att du vill ta bort
          {voucherNumber !== undefined
            ? ` verifikation ${voucherNumber}`
            : ' verifikationen'}
          ?
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          Åtgärden går inte att ångra.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color='inherit'>
          Avbryt
        </Button>

        <Button
          variant='contained'
          color='error'
          onClick={onConfirm}
          disabled={loading}
          startIcon={<DeleteOutlineOutlinedIcon />}>
          {loading ? 'Tar bort...' : 'Ta bort'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
