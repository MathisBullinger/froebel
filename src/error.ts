export class UniqueViolationError extends Error {
  constructor(msg: string) {
    super(`[UniqueViolationError]: ${msg}`);
  }
}
