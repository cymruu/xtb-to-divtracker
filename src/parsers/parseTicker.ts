export const parseTicker = (v: string, currency: string) => {
  if (currency === "USD") {
    return v.split(".")[0];
  }
  return v;
};
