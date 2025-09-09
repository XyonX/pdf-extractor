import express from "express";
import cors from "cors";
import morgan from "morgan";
import uploadPdf from "./src/routes/uploadRoutes.js"


const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));


//Routes

app.use("/api",uploadPdf);




export default app;
