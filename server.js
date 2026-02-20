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

app.post("/humanize", async (req, res) => {
  try {
    const { text, style, human_level, user_style_sample } = req.body;

    const prompt = `
Ubah teks berikut agar terdengar alami seperti tulisan manusia.
Gaya: ${style}
Tingkat kealamian: ${human_level}

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

    res.json({
      result: response.choices[0].message.content,
      score: 0.9
    });

  } catch (err) {
    res.status(500).json({ error: "Humanize gagal" });
  }
});

app.get("/", (req, res) => {
  res.send("AI Humanizer API aktif");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);