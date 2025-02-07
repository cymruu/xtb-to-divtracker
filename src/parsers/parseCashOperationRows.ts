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

type ParseCashOperationRowsResult =
  | {
      result: null;
      error: Error;
    }
  | {
      result: { currency: string; data: ParsedCashOperationLine[] };
      error: null;
    };

const findCurrency = (
  rows: string[][],
): { error: Error; result: null } | { error: null; result: string } => {
  for (const [index, row] of rows.entries()) {
    const [_c1, _c2, _c3, _c4, _c5, c6, ..._rest] = row;
    if (c6 === "Currency") {
      const currency = rows[index + 1][5];
      if (typeof currency === "string")
        return { error: null, result: currency };
    }
  }
  return { error: new Error("Currency not found"), result: null };
};

export const parseCashOperationRows = (
  rows: string[][],
): ParseCashOperationRowsResult => {
  console.log("rows", rows);
  const currencyParseResult = findCurrency(rows);
  console.log({ currencyParseResult });

  if (currencyParseResult.error) {
    return { error: currencyParseResult.error, result: null };
  }

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
    result: { currency: currencyParseResult.result, data },
  };
};
