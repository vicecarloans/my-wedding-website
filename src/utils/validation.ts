export const isNotEmpty = (...values: unknown[]) => {
  return values.every(
    (value) => value !== undefined && value !== null && value !== ""
  );
};
