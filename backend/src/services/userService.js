import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const updateProfile = async (userId, { fullName, phone }) => {
  const update = {};
  if (fullName) update.fullName = fullName;
  if (phone) update.phone = phone;

  const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found.');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect.');

  user.password = newPassword;
  await user.save();
  return user;
};
