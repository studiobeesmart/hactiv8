import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI(
    { 
        apiKey: process.env.GEMINI_API_KEY
    }
)

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

app.use(express.json());

app.post('/generate-from-document', upload.single("document"), async (req, res) => {

    const base64Document = req.file.buffer.toString("base64");
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {text: req.body.prompt ?? "Tolong buat ringkasan dari Dokumen berikut.",type:"text"},
                {inlineData:{data: base64Document, mimeType:req.file.mimetype}}

            ],
        })

        res.status(200).json({ result: response.text })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
