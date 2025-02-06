export const parseTicker = (v: string) => {
  const [symbol, exchange] = v.split(".");
  if (exchange === "US") {
    return symbol;
  }
  if (exchange === "UK") {
    return `${symbol}.GB`;
  }
  return v;
};
