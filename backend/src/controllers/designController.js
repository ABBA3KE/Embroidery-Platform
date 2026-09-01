// import path from 'path';
// import asyncHandler from '../utils/asyncHandler.js';
// import ApiError from '../utils/ApiError.js';
// import * as designService from '../services/designService.js';

// // ---- Public ----

// // @route  GET /api/designs
// // @access Public
// export const getDesigns = asyncHandler(async (req, res) => {
//   const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;
//   const result = await designService.listPublishedDesigns({ search, category, minPrice, maxPrice, sort, page, limit });
//   res.status(200).json({ success: true, data: result });
// });

// // @route  GET /api/designs/:slug
// // @access Public
// export const getDesign = asyncHandler(async (req, res) => {
//   const design = await designService.getPublishedDesignBySlug(req.params.slug);
//   res.status(200).json({ success: true, data: { design } });
// });

// // ---- Admin ----

// // @route  GET /api/admin/designs
// // @access Private/Admin
// export const getDesignsAdmin = asyncHandler(async (req, res) => {
//   const { page, limit, status, category, search } = req.query;
//   const result = await designService.listAllDesignsAdmin({ page, limit, status, category, search });
//   res.status(200).json({ success: true, data: result });
// });

// // @route  GET /api/admin/designs/:id
// // @access Private/Admin
// export const getDesignAdmin = asyncHandler(async (req, res) => {
//   const design = await designService.getDesignByIdAdmin(req.params.id);
//   res.status(200).json({ success: true, data: { design } });
// });

// // @route  POST /api/admin/designs
// // @access Private/Admin
// export const createDesign = asyncHandler(async (req, res) => {
//   console.log('createDesign hit, req.file:', req.file);
//   if (!req.file) {
//     throw new ApiError(400, 'A preview image is required.');
//   }
//   // const previewImage = `/assets/images/designs/${req.file.filename}`;
//   const previewImage = req.file.path;

//   let specifications = {};
//   if (req.body.specifications) {
//     try {
//       specifications = JSON.parse(req.body.specifications);
//     } catch {
//       throw new ApiError(400, 'Specifications must be valid JSON.');
//     }
//   }

//   const design = await designService.createDesign(
//     {
//       name: req.body.name,
//       description: req.body.description,
//       category: req.body.category,
//       price: req.body.price,
//       previewImage,
//       specifications,
//     },
//     req.user._id
//   );

//   res.status(201).json({ success: true, message: 'Design created.', data: { design } });
// });

// // @route  PUT /api/admin/designs/:id
// // @access Private/Admin
// export const updateDesign = asyncHandler(async (req, res) => {
//   const payload = { ...req.body };

//   if (req.body.specifications) {
//     try {
//       payload.specifications = JSON.parse(req.body.specifications);
//     } catch {
//       throw new ApiError(400, 'Specifications must be valid JSON.');
//     }
//   }
//   if (req.file) {
//     // payload.previewImage = `/assets/images/designs/${req.file.filename}`;
//     payload.previewImage = req.file.path;
//   }

//   const design = await designService.updateDesign(req.params.id, payload);
//   res.status(200).json({ success: true, message: 'Design updated.', data: { design } });
// });

// // @route  PATCH /api/admin/designs/:id/status
// // @access Private/Admin
// export const setDesignStatus = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   if (!['draft', 'published'].includes(status)) {
//     throw new ApiError(400, 'Status must be either "draft" or "published".');
//   }
//   const design = await designService.setDesignStatus(req.params.id, status);
//   res.status(200).json({
//     success: true,
//     message: status === 'published' ? 'Design published.' : 'Design unpublished.',
//     data: { design },
//   });
// });

// // @route  DELETE /api/admin/designs/:id
// // @access Private/Admin
// export const deleteDesign = asyncHandler(async (req, res) => {
//   await designService.deleteDesign(req.params.id);
//   res.status(200).json({ success: true, message: 'Design deleted.' });
// });

// // @route  POST /api/admin/designs/:id/files
// // @access Private/Admin
// // Uploads a protected .EMB / .EMX / .DST file into secure backend storage.
// export const uploadDesignFile = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     throw new ApiError(400, 'A file is required.');
//   }

//   const design = await designService.attachProtectedFile(req.params.id, {
//     format: req.body.format.toUpperCase(),
//     storedFilename: req.file.filename,
//     originalFilename: req.file.originalname,
//     sizeBytes: req.file.size,
//   });

//   res.status(200).json({
//     success: true,
//     message: `${req.body.format.toUpperCase()} file uploaded.`,
//     data: { design },
//   });
// });



import path from 'path';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import * as designService from '../services/designService.js';

// ---- Public ----

// @route  GET /api/designs
// @access Public
export const getDesigns = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;
  const result = await designService.listPublishedDesigns({ search, category, minPrice, maxPrice, sort, page, limit });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/designs/:slug
// @access Public
export const getDesign = asyncHandler(async (req, res) => {
  const design = await designService.getPublishedDesignBySlug(req.params.slug);
  res.status(200).json({ success: true, data: { design } });
});

// ---- Admin ----

// @route  GET /api/admin/designs
// @access Private/Admin
export const getDesignsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, status, category, search } = req.query;
  const result = await designService.listAllDesignsAdmin({ page, limit, status, category, search });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/admin/designs/:id
// @access Private/Admin
export const getDesignAdmin = asyncHandler(async (req, res) => {
  const design = await designService.getDesignByIdAdmin(req.params.id);
  res.status(200).json({ success: true, data: { design } });
});

// @route  POST /api/admin/designs
// @access Private/Admin
export const createDesign = asyncHandler(async (req, res) => {
  console.log('createDesign hit, req.file:', req.file);

  if (!req.file) {
    throw new ApiError(400, 'A preview image is required. Please select an image and try again.');
  }

  // Cloudinary upload URL
  const previewImage = req.file.path || req.file.secure_url;

  if (!previewImage) {
    throw new ApiError(400, 'Preview image was uploaded, but Cloudinary did not return an image URL.');
  }

  let specifications = {};
  if (req.body.specifications) {
    try {
      specifications = JSON.parse(req.body.specifications);
    } catch {
      throw new ApiError(400, 'Specifications must be valid JSON.');
    }
  }

  const design = await designService.createDesign(
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      previewImage,
      specifications,
    },
    req.user._id
  );

  res.status(201).json({ success: true, message: 'Design created.', data: { design } });
});

// @route  PUT /api/admin/designs/:id
// @access Private/Admin
export const updateDesign = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.body.specifications) {
    try {
      payload.specifications = JSON.parse(req.body.specifications);
    } catch {
      throw new ApiError(400, 'Specifications must be valid JSON.');
    }
  }

  if (req.file) {
    // Cloudinary upload URL
    payload.previewImage = req.file.path || req.file.secure_url;
  }

  const design = await designService.updateDesign(req.params.id, payload);
  res.status(200).json({ success: true, message: 'Design updated.', data: { design } });
});

// @route  PATCH /api/admin/designs/:id/status
// @access Private/Admin
export const setDesignStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['draft', 'published'].includes(status)) {
    throw new ApiError(400, 'Status must be either "draft" or "published".');
  }

  const design = await designService.setDesignStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    message: status === 'published' ? 'Design published.' : 'Design unpublished.',
    data: { design },
  });
});

// @route  DELETE /api/admin/designs/:id
// @access Private/Admin
export const deleteDesign = asyncHandler(async (req, res) => {
  await designService.deleteDesign(req.params.id);
  res.status(200).json({ success: true, message: 'Design deleted.' });
});

// @route  POST /api/admin/designs/:id/files
// @access Private/Admin
// Uploads a protected .EMB / .EMX / .DST file into secure backend storage.
export const uploadDesignFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'A design file is required.');
  }

  const format = (req.body.format || '').toUpperCase();

  if (!format) {
    throw new ApiError(400, 'Design file format is required.');
  }

  const design = await designService.attachProtectedFile(req.params.id, {
    format,
    storedFilename: req.file.filename,
    originalFilename: req.file.originalname,
    sizeBytes: req.file.size,
  });

  res.status(200).json({
    success: true,
    message: `${format} file uploaded.`,
    data: { design },
  });
});