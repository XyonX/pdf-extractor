// models/FileAsset.js
import { Schema, model, Document, Types } from "mongoose";

export interface FileAssetDoc extends Document {
  fileName: string;
  url: string; 
  uploadedBy?: Types.ObjectId; // Optional: if later add user auth 
  createdAt: Date;
}

const FileAssetSchema = new Schema<FileAssetDoc>(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true }, // Now required
  },
  { timestamps: { createdAt: true, updatedAt: false } } 
);

export const FileAsset = model<FileAssetDoc>("FileAsset", FileAssetSchema);