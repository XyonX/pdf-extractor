// middleware/upload.ts
import multer from "multer";
import { put } from '@vercel/blob';
import path from "path";

// Configure multer for memory storage (no disk storage needed)
const storage = multer.memoryStorage();

function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === "application/pdf" && ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
}

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Function to upload to Vercel Blob
export const uploadToVercelBlob = async (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, ext);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const blobName = `${baseName}-${uniqueSuffix}${ext}`;

  try {
    const blob = await put(blobName, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    });

    return blob;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload file to storage');
  }
};