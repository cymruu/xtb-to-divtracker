export const parseQuantity = (v: string) => {
  const parts = v.split(" ");
  const value = parts[2].split("/")[0];

  return `${parts[0] === "CLOSE" ? "-" : ""}${value}`;
};
