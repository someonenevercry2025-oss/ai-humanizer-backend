import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ROOT → JSON (bukan text)
app.get("/", (req, res) => {
  res.json({ status: "AI Humanizer API aktif" });
});

// HUMANIZE
app.post("/humanize", async (req, res) => {
  try {
    const { text, style, human_level, user_style_sample } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Teks kosong" });
    }

    const prompt = `
Ubah teks berikut agar terdengar alami seperti tulisan manusia.
Pertahankan makna asli.
Gaya: ${style || "netral"}
Tingkat kealamian: ${human_level || 0.8}

Contoh gaya user:
${user_style_sample || "tidak ada"}

Teks:
${text}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Kamu adalah AI humanizer teks." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });

    return res.json({
      result: response.choices[0].message.content,
      score: 0.9
    });

  } catch (err) {
    console.error("ERROR:", err.message);

    return res.status(500).json({
      error: "Humanize gagal",
      detail: err.message
    });
  }
});

// HANDLE ROUTE TIDAK ADA → JSON
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di " + PORT));