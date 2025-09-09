import { Router } from "express";
import { upload } from "../middleware/upload.ts";
import { uploadPdf } from "../controllers/uploadController.ts";


const router = Router();
router.post('/upload', upload.single('file'), uploadPdf);



export default router;
