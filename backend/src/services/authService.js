import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES } from '../config/constants.js';

export const registerUser = async ({ fullName, email, phone, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({ fullName, email, phone, password });

  await createNotification({
    user: user._id,
    type: NOTIFICATION_TYPES.REGISTRATION,
    title: 'Welcome to the platform',
    message: `Hi ${user.fullName.split(' ')[0]}, your account has been created successfully.`,
  });

  const token = generateToken(user._id);
  return { user: user.toSafeObject(), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.status === 'suspended') {
    throw new ApiError(403, 'This account has been suspended. Contact support for help.');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user._id);
  return { user: user.toSafeObject(), token };
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  // Always resolve without an error to avoid revealing which emails are registered.
  if (!user) return null;

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  // In production this raw token is emailed to the user, never returned by the API.
  return rawToken;
};

export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new ApiError(400, 'This reset link is invalid or has expired.');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  return { user: user.toSafeObject(), token };
};
