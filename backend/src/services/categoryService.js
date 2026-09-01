import Category from '../models/Category.js';
import Design from '../models/Design.js';
import ApiError from '../utils/ApiError.js';

export const listCategories = async ({ activeOnly = true } = {}) => {
  const filter = activeOnly ? { isActive: true } : {};
  const categories = await Category.find(filter).sort({ name: 1 });

  // Attach a live published-design count per category for the gallery filters.
  const counts = await Design.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

  return categories.map((cat) => ({
    ...cat.toObject(),
    designCount: countMap.get(String(cat._id)) || 0,
  }));
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug });
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};

export const createCategory = async (payload) => {
  return Category.create(payload);
};

export const updateCategory = async (id, payload) => {
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};

export const deleteCategory = async (id) => {
  const inUse = await Design.countDocuments({ category: id });
  if (inUse > 0) {
    throw new ApiError(409, `Cannot delete category — ${inUse} design(s) are still assigned to it.`);
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};
