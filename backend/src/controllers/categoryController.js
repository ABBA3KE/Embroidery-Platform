import asyncHandler from '../utils/asyncHandler.js';
import * as categoryService from '../services/categoryService.js';

// @route  GET /api/categories
// @access Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories({ activeOnly: true });
  res.status(200).json({ success: true, data: { categories } });
});

// @route  GET /api/admin/categories
// @access Private/Admin (includes inactive categories)
export const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories({ activeOnly: false });
  res.status(200).json({ success: true, data: { categories } });
});

// @route  GET /api/categories/:slug
// @access Public
export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.status(200).json({ success: true, data: { category } });
});

// @route  POST /api/categories
// @access Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, message: 'Category created.', data: { category } });
});

// @route  PUT /api/categories/:id
// @access Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Category updated.', data: { category } });
});

// @route  DELETE /api/categories/:id
// @access Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted.' });
});
