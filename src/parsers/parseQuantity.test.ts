import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseQuantity } from "./parseQuantity";

const testCases = [
  { input: "OPEN BUY 100 @ 9.895", expected: "100" },
  { input: "OPEN BUY 14/120 @ 62.34", expected: "14" },
  { input: "CLOSE BUY 10 @ 46.80", expected: "-10" },
  { input: "OPEN BUY 0.0736/4.0736 @ 61.370", expected: "0.0736" },
  { input: "CLOSE BUY 0.1995/61 @ 16.40", expected: "-0.1995" },
];

describe("parseQuantity", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input}`, async () => {
      const result = parseQuantity(testCase.input);

      equal(result, testCase.expected);
    });
  }
});
