export type Account = {
  id: string;
  account_number: number;
  name: string;
};

export type VoucherRowData = {
  accountId: string;
  debit: number;
  credit: number;
};
