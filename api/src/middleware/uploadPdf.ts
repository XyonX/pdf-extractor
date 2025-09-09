import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === "application/pdf" && ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
}

export const upload = multer({ storage, fileFilter });
