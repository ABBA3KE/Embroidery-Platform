import fs from 'fs';
import path from 'path';
import Design from '../models/Design.js';
import ApiError from '../utils/ApiError.js';

const SORT_MAP = {
  newest: { createdAt: -1 },
  popular: { purchaseCount: -1, viewCount: -1 },
  price_low: { price: 1 },
  price_high: { price: -1 },
};

/**
 * Public gallery query: search, category, price range, sort, pagination.
 * Always restricted to published designs and never returns protectedFiles.
 */
export const listPublishedDesigns = async ({
  search,
  category,
  minPrice,
  maxPrice,
  sort = 'newest',
  page = 1,
  limit = 12,
}) => {
  const filter = { status: 'published' };

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(48, Math.max(1, Number(limit) || 12));
  const skip = (pageNum - 1) * limitNum;
  const sortStage = SORT_MAP[sort] || SORT_MAP.newest;

  const [designs, total] = await Promise.all([
    Design.find(filter)
      .select('-protectedFiles')
      .populate('category', 'name slug')
      .sort(sortStage)
      .skip(skip)
      .limit(limitNum),
    Design.countDocuments(filter),
  ]);

  return {
    designs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    },
  };
};

export const getPublishedDesignBySlug = async (slug) => {
  const design = await Design.findOne({ slug, status: 'published' })
    .select('-protectedFiles')
    .populate('category', 'name slug');

  if (!design) throw new ApiError(404, 'Design not found.');

  design.viewCount += 1;
  await design.save();

  return design;
};

// ---- Admin ----

export const listAllDesignsAdmin = async ({ page = 1, limit = 20, status, category, search } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [designs, total] = await Promise.all([
    Design.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Design.countDocuments(filter),
  ]);

  return {
    designs,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const getDesignByIdAdmin = async (id) => {
  const design = await Design.findById(id).populate('category', 'name slug');
  if (!design) throw new ApiError(404, 'Design not found.');
  return design;
};

export const createDesign = async (payload, adminId) => {
  return Design.create({ ...payload, createdBy: adminId });
};

export const updateDesign = async (id, payload) => {
  const design = await Design.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!design) throw new ApiError(404, 'Design not found.');
  return design;
};

export const setDesignStatus = async (id, status) => {
  const design = await Design.findByIdAndUpdate(id, { status }, { new: true });
  if (!design) throw new ApiError(404, 'Design not found.');
  return design;
};

export const deleteDesign = async (id) => {
  const design = await Design.findById(id);
  if (!design) throw new ApiError(404, 'Design not found.');

  // Remove protected files from disk before deleting the record.
  const baseDir = path.resolve('src/storage/design-files');
  const folderMap = { EMB: 'emb', EMX: 'emx', DST: 'dst', PNG: 'png' };
  for (const file of design.protectedFiles) {
    const filePath = path.join(baseDir, folderMap[file.format], file.storedFilename);
    fs.promises.unlink(filePath).catch(() => {}); // best-effort cleanup
  }

  await design.deleteOne();
  return design;
};

export const attachProtectedFile = async (id, { format, storedFilename, originalFilename, sizeBytes }) => {
  const design = await Design.findById(id);
  if (!design) throw new ApiError(404, 'Design not found.');

  // Replace any existing file of the same format rather than duplicating.
  design.protectedFiles = design.protectedFiles.filter((f) => f.format !== format);
  design.protectedFiles.push({ format, storedFilename, originalFilename, sizeBytes });

  if (!design.availableFormats.includes(format)) {
    design.availableFormats.push(format);
  }

  await design.save();
  return design;
};

export const setPreviewImage = async (id, imagePath) => {
  const design = await Design.findByIdAndUpdate(id, { previewImage: imagePath }, { new: true });
  if (!design) throw new ApiError(404, 'Design not found.');
  return design;
};
