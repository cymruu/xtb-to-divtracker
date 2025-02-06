import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseTicker, TICKER_MAP } from "./parseTicker";

const testCases = [
  { input: { ticker: "UPS.US" }, expected: "UPS" },
  { input: { ticker: "IVG.IT" }, expected: "IVG.IT" },
  { input: { ticker: "JMT.PT" }, expected: "JMT.PT" },
  { input: { ticker: "XTB.PL" }, expected: "XTB.PL" },
  { input: { ticker: "RBOT.UK" }, expected: "RBOT.GB" },
];

describe("parseQuantity", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input.ticker} to ${testCase.expected}`, async () => {
      const result = parseTicker(testCase.input.ticker);

      equal(result, testCase.expected);
    });
  }

  describe("should return hardcoded value if ticker found in `TICKER_MAP`", () => {
    for (const [ticker, expected] of Object.entries(TICKER_MAP)) {
      it(`should properly parse ${ticker} to ${expected}`, () => {
        const result = parseTicker(ticker);

        equal(result, expected);
      });
    }
  });
});
