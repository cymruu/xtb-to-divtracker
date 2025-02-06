export const TICKER_MAP: Record<string, string | undefined> = {
  "VOW1.DE": "VOW.DE",
} as const;

export const parseTicker = (v: string) => {
  if (TICKER_MAP[v]) {
    return TICKER_MAP[v];
  }

  const [symbol, exchange] = v.split(".");
  if (exchange === "US") {
    return symbol;
  }
  if (exchange === "UK") {
    return `${symbol}.GB`;
  }
  return v;
};
