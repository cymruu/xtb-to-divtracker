export const parseTicker = (v: string) => {
  const [symbol, exchange] = v.split(".");
  if (exchange === "US") {
    return symbol;
  }
  return v;
};
