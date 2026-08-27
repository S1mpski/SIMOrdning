import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export type AccountListItem = {
  id: string;
  account_number: number;
  name: string;
  active: boolean;
};

type Props = {
  accounts: AccountListItem[];
};

export default function AccountList({ accounts }: Props) {
  if (accounts.length === 0) {
    return (
      <Paper variant='outlined' sx={{ p: 4 }}>
        <Typography color='text.secondary'>
          Det finns inga konton i kontoplanen.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 160 }}>Kontonummer</TableCell>

            <TableCell>Kontonamn</TableCell>

            <TableCell align='right' sx={{ width: 140 }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>
                  {account.account_number}
                </Typography>
              </TableCell>

              <TableCell>{account.name}</TableCell>

              <TableCell align='right'>
                <Chip
                  size='small'
                  label={account.active ? 'Aktivt' : 'Inaktivt'}
                  color={account.active ? 'success' : 'default'}
                  variant='outlined'
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
