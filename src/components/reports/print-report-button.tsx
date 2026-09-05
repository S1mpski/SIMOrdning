'use client';

import { useState } from 'react';

import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

import { Button, Menu, MenuItem } from '@mui/material';

export default function PrintReportButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handlePrint(report: 'income' | 'balance') {
    document.body.setAttribute('data-print-report', report);

    handleClose();

    setTimeout(() => {
      window.print();

      document.body.removeAttribute('data-print-report');
    }, 100);
  }

  return (
    <>
      <Button
        variant='outlined'
        startIcon={<PrintOutlinedIcon />}
        onClick={handleOpen}
        className='no-print'
        sx={{
          whiteSpace: 'nowrap',

          width: {
            xs: '100%',
            sm: 'auto',
          },

          alignSelf: {
            xs: 'stretch',
            sm: 'flex-start',
          },
        }}>
        Skriv ut
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handlePrint('income')}>
          Resultatrapport
        </MenuItem>

        <MenuItem onClick={() => handlePrint('balance')}>
          Balansrapport
        </MenuItem>
      </Menu>
    </>
  );
}
