import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/authService.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @route  POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  const { user, token } = await authService.registerUser({ fullName, email, phone, password });

  res.cookie('token', token, cookieOptions);
  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { user, token },
  });
});

// @route  POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  res.cookie('token', token, cookieOptions);
  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: { user, token },
  });
});

// @route  POST /api/auth/logout
// @access Private
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// @route  GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user.toSafeObject() } });
});

// @route  POST /api/auth/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const rawToken = await authService.requestPasswordReset(email);

  // Always return a generic success message so we never reveal
  // whether a given email address is registered.
  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent.',
    // resetToken is only ever included in non-production for local testing,
    // since this project has no email provider wired up yet.
    ...(process.env.NODE_ENV !== 'production' && rawToken ? { devResetToken: rawToken } : {}),
  });
});

// @route  POST /api/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const { user, token: authToken } = await authService.resetPassword(token, password);

  res.cookie('token', authToken, cookieOptions);
  res.status(200).json({
    success: true,
    message: 'Password reset successfully.',
    data: { user, token: authToken },
  });
});
