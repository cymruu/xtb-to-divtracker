export const createCashOperationRow = (i: number): string[] => {
  return [
    "",
    `transaction_id: ${i}`,
    `transaction_type: ${i}`,
    `transaction_time: ${i}`,
    `transaction_comment: ${i}`,
    `transaction_symbol: ${i}`,
    `transaction_amount: ${i}`,
  ];
};
