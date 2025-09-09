import express from "express";
import cors from "cors";
import morgan from "morgan";
import uploadPdf from "./src/routes/uploadRoutes.js"


// import uploadRoutes from "./src/routes/uploadRoutes";
// import invoiceRoutes from "./src/routes/invoiceRoutes";
// import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));


//Routes

app.use("/api",uploadPdf);


// // Routes
// app.use("/api", uploadRoutes);
// app.use("/api/invoices", invoiceRoutes);

// // Error Handler
// app.use(errorHandler);



export default app;
