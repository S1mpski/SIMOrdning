'use client';

import { useState } from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function handleSend() {
    const supportEmail = 'simordning.support@gmail.com';

    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailto;

    setOpen(false);
  }

  return (
    <>
      <Box
        component='footer'
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}>
        <Stack
          direction='row'
          sx={{
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Typography variant='body2' color='text.secondary'>
            © {new Date().getFullYear()} SIMOrdning
          </Typography>

          <Link
            href='https://github.com/S1mpski/SIMOrdning'
            target='_blank'
            rel='noopener noreferrer'
            color='text.secondary'
            underline='hover'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              fontSize: 14,
            }}>
            <GitHubIcon fontSize='small' />
            GitHub
          </Link>

          <Button
            variant='text'
            size='small'
            startIcon={<ReportProblemOutlinedIcon />}
            onClick={() => setOpen(true)}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              px: { xs: 2, sm: 3, md: 4 },
              py: 0,
            }}>
            Rapportera problem
          </Button>
        </Stack>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>Rapportera problem</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label='Ämne'
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              fullWidth
            />

            <TextField
              label='Beskriv problemet'
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              multiline
              minRows={5}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Avbryt</Button>

          <Button
            variant='contained'
            onClick={handleSend}
            disabled={!subject.trim() || !message.trim()}>
            Skicka
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
