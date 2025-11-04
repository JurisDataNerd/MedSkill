import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Gunakan route email (penting)
app.use("/api/email", emailRoutes);

// 🔹 Default root handler
app.get("/", (req, res) => {
  res.send("✅ Backend MedSkill API berjalan dengan baik!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
