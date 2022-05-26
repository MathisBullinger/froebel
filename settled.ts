/** Checks if `result` (returned from `Promise.allSettled`) is fulfilled. */
export const isFulfilled = <T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> => result.status === "fulfilled";

/** Checks if `result` (returned from `Promise.allSettled`) is rejected. */
export const isRejected = (
  result: PromiseSettledResult<unknown>,
): result is PromiseRejectedResult => result.status === "rejected";
