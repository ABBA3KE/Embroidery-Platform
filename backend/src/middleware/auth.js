import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

/**
 * Verifies the JWT (from the Authorization header or an httpOnly cookie),
 * loads the user, and attaches it to req.user. Rejects if the token is
 * missing, invalid, expired, or the account no longer exists / is suspended.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in to continue.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Session expired or invalid. Please log in again.');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, 'The user for this session no longer exists.');
  }

  if (user.status === 'suspended') {
    throw new ApiError(403, 'This account has been suspended. Contact support for help.');
  }

  req.user = user;
  next();
});

/**
 * Restricts access to the given roles. Use after `protect`.
 * Example: router.get('/admin', protect, authorize('admin'), handler)
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action.');
  }
  next();
};
