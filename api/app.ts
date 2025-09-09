import express from "express";
import cors from "cors";
// import uploadRoutes from "./src/routes/uploadRoutes";
// import invoiceRoutes from "./src/routes/invoiceRoutes";
// import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api", uploadRoutes);
// app.use("/api/invoices", invoiceRoutes);

// // Error Handler
// app.use(errorHandler);

export default app;
