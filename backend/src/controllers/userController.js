import asyncHandler from '../utils/asyncHandler.js';
import * as userService from '../services/userService.js';

// @route  PUT /api/users/me
// @access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.status(200).json({ success: true, message: 'Profile updated.', data: { user: user.toSafeObject() } });
});

// @route  PUT /api/users/me/password
// @access Private
export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  res.status(200).json({ success: true, message: 'Password changed successfully.' });
});
