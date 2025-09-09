import { Request, Response, NextFunction } from "express";
import { FileAsset } from "../models/FileAsset.ts";
import { uploadToVercelBlob } from '../middleware/upload.ts';

export async function uploadPdf(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Vercel Blob
    const blob = await uploadToVercelBlob(req.file);

    // Save file metadata to MongoDB
    const fileAsset = new FileAsset({
      fileName: req.file.originalname,
      url: blob.url,
    });

    await fileAsset.save();

    // Return only fileId and fileName as requested
    res.status(201).json({
      fileId: fileAsset._id,
      fileName: fileAsset.fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }

}
