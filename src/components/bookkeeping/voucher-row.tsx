'use client';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, TableCell, TableRow, TextField } from '@mui/material';

import AccountSelect, {
  Account,
} from '@/components/bookkeeping/account-select';

export type VoucherRowData = {
  id: string;
  account: Account | null;
  debit: string;
  credit: string;
};

type Props = {
  row: VoucherRowData;
  accounts: Account[];
  onChange: (row: VoucherRowData) => void;
  onDelete: () => void;
  canDelete: boolean;
};

export default function VoucherRow({
  row,
  accounts,
  onChange,
  onDelete,
  canDelete,
}: Props) {
  return (
    <TableRow>
      <TableCell sx={{ width: '55%' }}>
        <AccountSelect
          accounts={accounts}
          value={row.account}
          onChange={(account) =>
            onChange({
              ...row,
              account,
            })
          }
        />
      </TableCell>

      <TableCell sx={{ width: 180 }}>
        <TextField
          size='small'
          type='number'
          value={row.debit}
          onChange={(event) =>
            onChange({
              ...row,
              debit: event.target.value,
              credit: Number(event.target.value) > 0 ? '' : row.credit,
            })
          }
          inputProps={{
            min: 0,
            step: '0.01',
          }}
        />
      </TableCell>

      <TableCell sx={{ width: 180 }}>
        <TextField
          size='small'
          type='number'
          value={row.credit}
          onChange={(event) =>
            onChange({
              ...row,
              credit: event.target.value,
              debit: Number(event.target.value) > 0 ? '' : row.debit,
            })
          }
          inputProps={{
            min: 0,
            step: '0.01',
          }}
        />
      </TableCell>

      <TableCell align='right' sx={{ width: 60 }}>
        <IconButton
          onClick={onDelete}
          disabled={!canDelete}
          aria-label='Ta bort rad'>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
