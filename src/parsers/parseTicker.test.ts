import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseTicker } from "./parseTicker";

const testCases = [
  { input: { ticker: "UPS.US" }, expected: "UPS" },
  { input: { ticker: "IVG.IT" }, expected: "IVG.IT" },
  { input: { ticker: "JMT.PT" }, expected: "JMT.PT" },
  { input: { ticker: "XTB.PL" }, expected: "XTB.PL" },
  { input: { ticker: "RBOT.UK" }, expected: "RBOT.GB" },
];

describe("parseQuantity", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input.ticker}`, async () => {
      const result = parseTicker(testCase.input.ticker);

      equal(result, testCase.expected);
    });
  }
});
