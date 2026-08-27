'use client';

import { Autocomplete, TextField } from '@mui/material';

export type Account = {
  id: string;
  account_number: number;
  name: string;
};

type Props = {
  accounts: Account[];
  value: Account | null;
  onChange: (account: Account | null) => void;
  disabled?: boolean;
};

export default function AccountSelect({
  accounts,
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <Autocomplete
      options={accounts}
      value={value}
      disabled={disabled}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      getOptionLabel={(option) => `${option.account_number} – ${option.name}`}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      renderInput={(params) => (
        <TextField {...params} placeholder='Välj konto' size='small' />
      )}
      sx={{
        minWidth: 280,
      }}
    />
  );
}
