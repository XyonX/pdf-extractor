import express from "express";
import cors from "cors";
import morgan from "morgan";
import uploadPdf from "./src/routes/uploadRoutes.js"
import fileMeta from "./src/routes/fileMetaRoutes.js";



const app = express();

// Middlewares
// Allow only the deployed frontend
app.use(
  cors({
    origin: "https://invoice-extractor-rosy.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // set true if you need to send cookies/auth headers
  })
);

// enable preflight for all routes
app.options("*", cors());


app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));


//Routes`

app.use("/api",uploadPdf);
app.use("/api",fileMeta);



export default app;
