export const assert = (condition: unknown, message?: string, type = Error) => {
  if (!(typeof condition === "function" ? condition() : condition)) {
    throw new type(message);
  }
};
