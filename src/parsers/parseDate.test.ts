import { equal } from "node:assert";
import { describe, it } from "node:test";

import { parseDate } from "./parseDate";

const testCases = [
  { input: "10.05.2024 12:34:12", expected: "2024-05-10" },
  { input: "03.12.2023 02:54:21", expected: "2023-12-03" },
];

describe("parseDate", () => {
  for (const testCase of testCases) {
    it(`should properly parse ${testCase.input}`, async () => {
      const result = parseDate(testCase.input);

      equal(result, testCase.expected);
    });
  }
});
