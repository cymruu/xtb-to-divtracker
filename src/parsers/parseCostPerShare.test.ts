import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseCostPerShare } from "./parseCostPerShare";

const testCases = [
  { input: "OPEN BUY 100 @ 9.895", expected: "9.895" },
  { input: "OPEN BUY 14/120 @ 62.34", expected: "62.34" },
  { input: "CLOSE BUY 10 @ 46.80", expected: "46.80" },
  { input: "OPEN BUY 0.0736/4.0736 @ 61.370", expected: "61.370" },
  { input: "CLOSE BUY 0.1995/61 @ 16.40", expected: "16.40" },
];

describe("parseCostPerShare", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input}`, async () => {
      const result = parseCostPerShare(testCase.input);

      equal(result, testCase.expected);
    });
  }
});
