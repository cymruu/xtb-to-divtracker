import { deepEqual, equal } from "node:assert";
import { describe, it } from "node:test";

import { createCashOperationRow } from "../../tests/utils/index.ts";
import { parseCashOperationRows } from "./parseCashOperationRows.ts";

describe("parseCashOperationRows", () => {
  it("should skip first 11 lines", () => {
    const result = parseCashOperationRows(
      Array.from({ length: 12 }).map((_, i) => createCashOperationRow(i)),
    );

    equal(result.error, null);
    deepEqual(result.result, [
      [
        "transaction_id: 11",
        "transaction_type: 11",
        "transaction_time: 11",
        "transaction_comment: 11",
        "transaction_symbol: 11",
        "transaction_amount: 11",
      ],
    ]);
  });

  it("should skip the first 11 lines and parse the rest", () => {
    const numberOfRows = 22;
    const expectedNumberOfParsedRows = 22 - 11;

    const rawRows = Array.from({ length: numberOfRows }).map((_, i) =>
      createCashOperationRow(i),
    );

    const result = parseCashOperationRows(rawRows);

    equal(result.error, null);
    equal(result.result.length, expectedNumberOfParsedRows);
    deepEqual(
      result.result,
      Array.from({ length: expectedNumberOfParsedRows }).map((_, i) => [
        `transaction_id: ${i + 11}`,
        `transaction_type: ${i + 11}`,
        `transaction_time: ${i + 11}`,
        `transaction_comment: ${i + 11}`,
        `transaction_symbol: ${i + 11}`,
        `transaction_amount: ${i + 11}`,
      ]),
    );
  });
});
