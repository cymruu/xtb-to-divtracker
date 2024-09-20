import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseTicker } from "./parseTicker";

const testCases = [
  { input: { ticker: "UPS.US", currency: "USD" }, expected: "UPS" },
  { input: { ticker: "JMT.PT", currency: "EUR" }, expected: "JMT.PT" },
  { input: { ticker: "XTB.PL", currency: "PLN" }, expected: "XTB.PL" },
];

describe("parseQuantity", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input.ticker} in currency ${testCase.input.currency}`, async () => {
      const result = parseTicker(
        testCase.input.ticker,
        testCase.input.currency,
      );

      equal(result, testCase.expected);
    });
  }
});
