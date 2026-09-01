/**
 * Wraps an async Express route handler so rejected promises are
 * forwarded to the centralized error-handling middleware instead of
 * crashing the process or requiring a try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
