import { Router } from "express";
import mongoose from "mongoose";
import { FileAsset } from "../models/FileAsset.ts";

const router = Router();

router.get("/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid fileId" });
    }
    const file = await FileAsset.findById(id).lean();
    if (!file) return res.status(404).json({ error: "File not found" });

    res.json({
      fileId: file._id.toString(),
      name: file.fileName,
      blobUrl: file.url,
      createdAt: file.createdAt,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;