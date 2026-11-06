
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import inquiryRoutes from "./routes/inquiries.js";
import favoriteRoutes from "./routes/favourite.js";
import adminRoutes from "./routes/admin.js";
import complaintRoutes from "./routes/complaints.js";

import { initDB } from "./db.js";
import { seedDB } from "./utils/seed.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // CORS configuration
  const allowedOrigins = [
    process.env.CLIENT_URL?.trim().replace(/\/$/, ""),
    "http://localhost:5173",
  ].filter(Boolean);

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "HouseHunt Backend is running",
    });
  });   

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/properties", propertyRoutes);
  app.use("/api/inquiries", inquiryRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/complaints", complaintRoutes);

  // Serve uploaded images
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
  );

  // Vite middleware ONLY for local development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } =
      await import("vite");

    const vite = await createViteServer({
      root: path.resolve(__dirname, "../Client/my-react-app"),
      configFile: path.resolve(
        __dirname,
        "../Client/my-react-app/vite.config.js"
      ),
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  }

  // Handle unknown API routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Initialize database before accepting requests
  await initDB();
  await seedDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HouseHunt Backend running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
