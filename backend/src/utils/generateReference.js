import crypto from 'crypto';

/**
 * Generates a short, unique, human-readable reference string.
 * Example: generateReference('ORD') -> "ORD-1971234567-a1b2c3d4"
 */
const generateReference = (prefix) => `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

export default generateReference;
