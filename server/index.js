import express from "express";
import { createServer as createViteServer } from "vite";
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
import { log } from "console";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename , __dirname);


async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // ... DB init code ...
 initDB().then(() => {
    seedDB();
  }).catch(err => {
    console.error("Database initialization failed:", err);
  });

  app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/properties", propertyRoutes);
  app.use("/api/inquiries", inquiryRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/complaints", complaintRoutes);

  // Serve uploaded images
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    // Go up from Server, into Client, then into my-react-app
    root: path.resolve(__dirname, "../Client/my-react-app"), 
    configFile: path.resolve(__dirname, "../Client/my-react-app/vite.config.js"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  // Production paths (if you build inside the Client/my-react-app folder)
  app.use(express.static(path.join(__dirname, "../Client/my-react-app/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/my-react-app/dist/index.html"));
  });
}

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();