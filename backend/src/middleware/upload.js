// import dotenv from 'dotenv';
// dotenv.config();

// import multer from 'multer';
// import cloudinary from 'cloudinary';
// import CloudinaryStorage from 'multer-storage-cloudinary';
// import path from 'path';
// import crypto from 'crypto';
// import fs from 'fs';
// import ApiError from '../utils/ApiError.js';

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const PROTECTED_BASE_DIR = path.resolve('src/storage/design-files');

// const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
// const FORMAT_TO_FOLDER = { EMB: 'emb', EMX: 'emx', PNG: 'png', DST: 'dst' };
// // Embroidery formats aren't standard registered MIME types, so we validate by extension + size instead.
// const PROTECTED_EXTENSIONS = { EMB: '.emb', EMX: '.emx', PNG: '.png', DST: '.dst' };

// const safeFilename = (originalName) => {
//   const ext = path.extname(originalName).toLowerCase();
//   const random = crypto.randomBytes(8).toString('hex');
//   return `${Date.now()}-${random}${ext}`;
// };

// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// };

// // ---- Public preview image upload (design cards, gallery, category images) ----
// // Stored on Cloudinary instead of local disk — required for Render/Vercel split hosting,
// // since Render's local disk is ephemeral and Vercel can't read Render's filesystem anyway.
// // const previewImageStorage = new CloudinaryStorage({
// //   cloudinary,
// //   params: {
// //     folder: 'embroidery-platform/designs',
// //     allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
// //     public_id: (req, file) => {
// //       const base = path.parse(file.originalname).name.toLowerCase().replace(/\s+/g, '-');
// //       return `${base}-${Date.now()}`;
// //     },
// //   },
// // });
// const previewImageStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'embroidery-platform/designs',
//     allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
//   },
// });

// export const uploadPreviewImage = multer({
//   storage: previewImageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
//       return cb(new ApiError(400, 'Preview image must be a PNG, JPEG, or WEBP file.'));
//     }
//     cb(null, true);
//   },
// });

// // ---- Protected embroidery file upload (.EMB / .EMX / .PNG design files) ----
// // The target format is read from req.body.format, validated, then routed
// // to its own storage subfolder — this is never reachable under frontend/public.
// // NOTE: still local disk — fine for local dev, but will be wiped on every Render
// // redeploy/restart in production. Migrate this to Cloudinary (raw resource_type)
// // or S3 before relying on it in production.
// const protectedFileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const format = (req.body.format || '').toUpperCase();
//     const folder = FORMAT_TO_FOLDER[format];
//     if (!folder) {
//       return cb(new ApiError(400, 'A valid format (EMB, EMX, DST, or PNG) must be specified.'));
//     }
//     const dir = path.join(PROTECTED_BASE_DIR, folder);
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
// });

// export const uploadProtectedFile = multer({
//   storage: protectedFileStorage,
//   limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
//   fileFilter: (req, file, cb) => {
//     const format = (req.body.format || '').toUpperCase();
//     const expectedExt = PROTECTED_EXTENSIONS[format];
//     const actualExt = path.extname(file.originalname).toLowerCase();

//     if (!expectedExt) {
//       return cb(new ApiError(400, 'A valid format (EMB, EMX, DST, or PNG) must be specified.'));
//     }
//     if (actualExt !== expectedExt) {
//       return cb(new ApiError(400, `File extension must match the selected format (${expectedExt}).`));
//     }
//     cb(null, true);
//   },
// });

// // ---- Repair service uploads (customer's existing file + optional reference image) ----
// const REPAIR_DIR = path.resolve('src/uploads/repairs');
// const EMBROIDERY_EXTENSIONS = ['.emb', '.emx', '.dst', '.pes', '.jef', '.vp3', '.xxx', '.png'];

// const repairStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     ensureDir(REPAIR_DIR);
//     cb(null, REPAIR_DIR);
//   },
//   filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
// });

// export const uploadRepairFiles = multer({
//   storage: repairStorage,
//   limits: { fileSize: 25 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();

//     if (file.fieldname === 'referenceImage') {
//       if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
//         return cb(new ApiError(400, 'Reference image must be a PNG, JPEG, or WEBP file.'));
//       }
//       return cb(null, true);
//     }

//     if (file.fieldname === 'originalFile' || file.fieldname === 'repairedFile') {
//       if (!EMBROIDERY_EXTENSIONS.includes(ext)) {
//         return cb(new ApiError(400, `Unsupported file type. Accepted: ${EMBROIDERY_EXTENSIONS.join(', ')}`));
//       }
//       return cb(null, true);
//     }

//     cb(new ApiError(400, 'Unexpected file field.'));
//   },
// });

// // ---- Custom design request uploads (customer reference image + admin completed file) ----
// const CUSTOM_DESIGN_REFERENCES_DIR = path.resolve('src/storage/custom-designs/references');
// const CUSTOM_DESIGN_COMPLETED_DIR = path.resolve('src/storage/custom-designs/completed');

// const customDesignReferenceStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     ensureDir(CUSTOM_DESIGN_REFERENCES_DIR);
//     cb(null, CUSTOM_DESIGN_REFERENCES_DIR);
//   },
//   filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
// });

// export const uploadCustomDesignReference = multer({
//   storage: customDesignReferenceStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
//       return cb(new ApiError(400, 'Reference image must be a PNG, JPEG, or WEBP file.'));
//     }
//     cb(null, true);
//   },
// });

// const customDesignCompletedStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     ensureDir(CUSTOM_DESIGN_COMPLETED_DIR);
//     cb(null, CUSTOM_DESIGN_COMPLETED_DIR);
//   },
//   filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
// });

// export const uploadCustomDesignCompletedFile = multer({
//   storage: customDesignCompletedStorage,
//   limits: { fileSize: 25 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const format = (req.body.format || '').toUpperCase();
//     const expectedExt = PROTECTED_EXTENSIONS[format];
//     const actualExt = path.extname(file.originalname).toLowerCase();

//     if (!expectedExt) {
//       return cb(new ApiError(400, 'A valid format (EMB, EMX, DST, or PNG) must be specified.'));
//     }
//     if (actualExt !== expectedExt) {
//       return cb(new ApiError(400, `File extension must match the selected format (${expectedExt}).`));
//     }
//     cb(null, true);
//   },
// });


import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import cloudinary from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PROTECTED_BASE_DIR = path.resolve('src/storage/design-files');

const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const FORMAT_TO_FOLDER = { EMB: 'emb', EMX: 'emx', PNG: 'png', DST: 'dst' };

// Embroidery formats aren't standard registered MIME types,
// so they are validated by extension + size instead.
const PROTECTED_EXTENSIONS = {
  EMB: '.emb',
  EMX: '.emx',
  PNG: '.png',
  DST: '.dst',
};

const safeFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const random = crypto.randomBytes(8).toString('hex');
  return `${Date.now()}-${random}${ext}`;
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ---- Public preview image upload ----
// Design cards, gallery, category images, etc.
// Images are stored on Cloudinary so they work correctly
// when the backend is deployed on Render and the frontend on Vercel.

const previewImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'embroidery-platform/designs',
    allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
  },
});

export const uploadPreviewImage = multer({
  storage: previewImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    console.log('Preview image received:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    if (file.fieldname !== 'previewImage') {
      return cb(
        new ApiError(
          400,
          `Unexpected file field "${file.fieldname}". Expected "previewImage".`
        )
      );
    }

    if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ApiError(
          400,
          'Preview image must be a PNG, JPEG, or WEBP file.'
        )
      );
    }

    cb(null, true);
  },
});

// ---- Protected embroidery file upload ----
// .EMB / .EMX / .PNG / .DST design files

const protectedFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const format = (req.body.format || '').toUpperCase();
    const folder = FORMAT_TO_FOLDER[format];

    if (!folder) {
      return cb(
        new ApiError(
          400,
          'A valid format (EMB, EMX, DST, or PNG) must be specified.'
        )
      );
    }

    const dir = path.join(PROTECTED_BASE_DIR, folder);

    ensureDir(dir);

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

export const uploadProtectedFile = multer({
  storage: protectedFileStorage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const format = (req.body.format || '').toUpperCase();
    const expectedExt = PROTECTED_EXTENSIONS[format];
    const actualExt = path.extname(file.originalname).toLowerCase();

    if (!expectedExt) {
      return cb(
        new ApiError(
          400,
          'A valid format (EMB, EMX, DST, or PNG) must be specified.'
        )
      );
    }

    if (actualExt !== expectedExt) {
      return cb(
        new ApiError(
          400,
          `File extension must match the selected format (${expectedExt}).`
        )
      );
    }

    cb(null, true);
  },
});

// ---- Repair service uploads ----
// Customer existing file + optional reference image

const REPAIR_DIR = path.resolve('src/uploads/repairs');

const EMBROIDERY_EXTENSIONS = [
  '.emb',
  '.emx',
  '.dst',
  '.pes',
  '.jef',
  '.vp3',
  '.xxx',
  '.png',
];

const repairStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(REPAIR_DIR);
    cb(null, REPAIR_DIR);
  },

  filename: (req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

export const uploadRepairFiles = multer({
  storage: repairStorage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'referenceImage') {
      if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
        return cb(
          new ApiError(
            400,
            'Reference image must be a PNG, JPEG, or WEBP file.'
          )
        );
      }

      return cb(null, true);
    }

    if (
      file.fieldname === 'originalFile' ||
      file.fieldname === 'repairedFile'
    ) {
      if (!EMBROIDERY_EXTENSIONS.includes(ext)) {
        return cb(
          new ApiError(
            400,
            `Unsupported file type. Accepted: ${EMBROIDERY_EXTENSIONS.join(', ')}`
          )
        );
      }

      return cb(null, true);
    }

    cb(new ApiError(400, 'Unexpected file field.'));
  },
});

// ---- Custom design request uploads ----
// Customer reference image + admin completed file

const CUSTOM_DESIGN_REFERENCES_DIR = path.resolve(
  'src/storage/custom-designs/references'
);

const CUSTOM_DESIGN_COMPLETED_DIR = path.resolve(
  'src/storage/custom-designs/completed'
);

const customDesignReferenceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(CUSTOM_DESIGN_REFERENCES_DIR);
    cb(null, CUSTOM_DESIGN_REFERENCES_DIR);
  },

  filename: (req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

export const uploadCustomDesignReference = multer({
  storage: customDesignReferenceStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ApiError(
          400,
          'Reference image must be a PNG, JPEG, or WEBP file.'
        )
      );
    }

    cb(null, true);
  },
});

const customDesignCompletedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(CUSTOM_DESIGN_COMPLETED_DIR);
    cb(null, CUSTOM_DESIGN_COMPLETED_DIR);
  },

  filename: (req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

export const uploadCustomDesignCompletedFile = multer({
  storage: customDesignCompletedStorage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const format = (req.body.format || '').toUpperCase();
    const expectedExt = PROTECTED_EXTENSIONS[format];
    const actualExt = path.extname(file.originalname).toLowerCase();

    if (!expectedExt) {
      return cb(
        new ApiError(
          400,
          'A valid format (EMB, EMX, DST, or PNG) must be specified.'
        )
      );
    }

    if (actualExt !== expectedExt) {
      return cb(
        new ApiError(
          400,
          `File extension must match the selected format (${expectedExt}).`
        )
      );
    }

    cb(null, true);
  },
});