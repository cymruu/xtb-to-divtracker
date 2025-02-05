type TransactionIdCell = string;
type TransactionTypeCell = string;
type TransactionTimeCell = string;
type TransactioCommentCell = string;
type TransactionSymbolCell = string;
type TransactionAmountCel = string;

type ParsedCashOperationLine = [
  TransactionIdCell,
  TransactionTypeCell,
  TransactionTimeCell,
  TransactioCommentCell,
  TransactionSymbolCell,
  TransactionAmountCel,
];

type ParseCashOperationRowsResult = {
  result: ParsedCashOperationLine[];
  error: string | null;
};

export const parseCashOperationRows = (
  rows: string[][],
): ParseCashOperationRowsResult => {
  // data starts at row 12
  const data = rows.splice(11).map((row) => {
    const [
      _empty_cell,
      transaction_id,
      transaction_type,
      transaction_time,
      transaction_comment,
      transaction_symbol,
      transaction_amount,
    ] = row;

    const parsedRow: ParsedCashOperationLine = [
      transaction_id,
      transaction_type,
      transaction_time,
      transaction_comment,
      transaction_symbol,
      transaction_amount,
    ];
    return parsedRow;
  });

  return {
    error: null,
    result: data,
  };
};
