import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/humanize", async (req, res) => {
  try {
    const { text, style } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Teks kosong" });
    }

    const prompt = `
Ubah teks berikut agar terasa seperti ditulis manusia.
Gaya: ${style || "natural santai"}
Teks:
${text}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await response.json();

    const output =
      data.output?.[0]?.content?.[0]?.text || "Gagal memproses";

    res.json({ result: output });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Humanize gagal" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend Humanizer aktif");
});

app.listen(3000, () => console.log("Server jalan di port 3000"));