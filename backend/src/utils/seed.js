import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Design from '../models/Design.js';
import mongoose from 'mongoose';

const SAMPLE_CATEGORIES = [
  { name: 'Logos', description: 'Brand and business logo embroidery.' },
  { name: 'Names & Text', description: 'Monograms, names and custom lettering.' },
  { name: 'Fashion', description: 'Apparel-ready embroidery motifs.' },
  { name: 'Floral', description: 'Flowers, botanicals and nature motifs.' },
  { name: 'Traditional', description: 'Heritage and cultural patterns.' },
  { name: 'Corporate', description: 'Uniform and workwear branding.' },
  { name: 'School', description: 'School crests, mascots and badges.' },
  { name: 'Cap Designs', description: 'Compact designs sized for caps.' },
  { name: 'T-Shirt Designs', description: 'Bold designs for apparel fronts and backs.' },
  { name: 'Baby Designs', description: 'Soft, playful motifs for baby wear.' },
  { name: 'Religious Designs', description: 'Faith-based symbols and motifs.' },
  { name: 'Decorative Designs', description: 'Ornamental patterns and borders.' },
  { name: 'Others', description: 'Everything else.' },
];

// previewImage paths reference frontend/public/assets/images/designs/ —
// see the README for how to drop real preview images into that folder.
const SAMPLE_DESIGNS = [
  { name: 'Classic Rose Bouquet', categoryName: 'Floral', price: 3500, previewImage: '/assets/images/designs/floral-001.png', description: 'A hand-digitized rose bouquet, ideal for tote bags and home linens.', availableFormats: ['ENB', 'EMX', 'PNG'], specifications: { stitchCount: 8200, dimensions: '4x4 in', colors: 6 } },
  { name: 'Minimal Wordmark Logo', categoryName: 'Logos', price: 8000, previewImage: '/assets/images/designs/logo-001.png', description: 'A clean sans-serif wordmark digitized for polos and caps.', availableFormats: ['ENB', 'EMX'], specifications: { stitchCount: 3400, dimensions: '3x8 in', colors: 2 } },
  { name: 'Snapback Bee Emblem', categoryName: 'Cap Designs', price: 4500, previewImage: '/assets/images/designs/cap-001.png', description: 'A compact bee emblem sized for structured caps.', availableFormats: ['ENB', 'PNG'], specifications: { stitchCount: 5100, dimensions: '2x2 in', colors: 4 } },
  { name: 'Retro Varsity Number', categoryName: 'Fashion', price: 5500, previewImage: '/assets/images/designs/fashion-001.png', description: 'A retro varsity-style number set for jackets and tees.', availableFormats: ['ENB', 'EMX', 'PNG'], specifications: { stitchCount: 6700, dimensions: '5x5 in', colors: 3 } },
];

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Seeds baseline accounts so the platform is usable immediately after setup.
 * Re-running this script is safe — it skips accounts that already exist.
 * More seed data (categories, designs) is added as those features are built.
 */
const run = async () => {
  await connectDB();

  const adminEmail = 'admin@stitchfolio.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      fullName: 'Platform Admin',
      email: adminEmail,
      phone: '+2348000000000',
      password: 'Admin@12345',
      role: 'admin',
    });
    console.log(`Created admin account: ${adminEmail} / Admin@12345 (change this password immediately)`);
  } else {
    console.log('Admin account already exists — skipping.');
  }

  const customerEmail = 'customer@stitchfolio.com';
  const existingCustomer = await User.findOne({ email: customerEmail });
  if (!existingCustomer) {
    await User.create({
      fullName: 'Sample Customer',
      email: customerEmail,
      phone: '+2348111111111',
      password: 'Customer@12345',
      role: 'customer',
    });
    console.log(`Created sample customer: ${customerEmail} / Customer@12345`);
  } else {
    console.log('Sample customer already exists — skipping.');
  }

  const admin = await User.findOne({ email: adminEmail });

  for (const cat of SAMPLE_CATEGORIES) {
    const exists = await Category.findOne({ slug: slugify(cat.name) });
    if (!exists) await Category.create(cat);
  }
  console.log(`Ensured ${SAMPLE_CATEGORIES.length} sample categories exist.`);

  for (const sample of SAMPLE_DESIGNS) {
    const exists = await Design.findOne({ name: sample.name });
    if (exists) continue;

    const category = await Category.findOne({ slug: slugify(sample.categoryName) });
    if (!category) continue;

    await Design.create({
      name: sample.name,
      description: sample.description,
      category: category._id,
      price: sample.price,
      previewImage: sample.previewImage,
      availableFormats: sample.availableFormats,
      specifications: sample.specifications,
      status: 'published',
      createdBy: admin?._id,
    });
  }
  console.log(`Ensured ${SAMPLE_DESIGNS.length} sample designs exist.`);
  console.log('Note: sample designs reference preview images that must be added to frontend/public/assets/images/designs/ (see README).');

  await mongoose.disconnect();
  console.log('Seeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
