import express from 'express';
import multer from 'multer';
import path from 'path';
import { put } from '@vercel/blob';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/pdf' && ext === '.pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed!'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadToVercelBlob = async (file: Express.Multer.File) => {
  if (!file?.buffer) {
    throw new Error('File buffer missing – check multer config or field name');
  }
  const ext = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, ext);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const blobName = `${baseName}-${uniqueSuffix}${ext}`;

  const blob = await put(blobName, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });

  return blob;
};

// Route
const router = express.Router();
router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const blob = await uploadToVercelBlob(req.file);
    res.json({ url: blob.url });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;