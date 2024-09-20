export const parseDate = (v: string) => {
  const parts = v.split(" ");
  const date = parts[0];
  const dateElements = date.split(".");

  return dateElements.reverse().join("-");
};
