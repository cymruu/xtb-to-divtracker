import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseDate } from "./parseDate";

const testCases = [
  { input: "29/01/2024 22:39:13", expected: "2024-01-29" },
  { input: "07/06/2024 12:00:10", expected: "2024-06-07" },
  { input: "01/01/3000 22:39:13 bloat", expected: "3000-01-01" },
];

describe("parseDate", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input}`, async () => {
      const result = parseDate(testCase.input);

      equal(result, testCase.expected);
    });
  }
});
