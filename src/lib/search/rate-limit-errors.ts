export const RATE_LIMIT_ERROR_MESSAGE =
  "You've reached the maximum number of searches for this time period. Please try again later.";

export class RateLimitError extends Error {
  constructor() {
    super(RATE_LIMIT_ERROR_MESSAGE);
    this.name = 'RateLimitError';
  }
}
