export const parseCostPerShare = (v: string) => {
  const parts = v.split(" ");

  return parts[4];
};
