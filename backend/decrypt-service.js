import dotenv from "dotenv";
// Load environment variables from .env file
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
dotenv.config();
const app = express();
const PORT = 5000;

// Replace this with your shared 256-bit AES key (Base64)
const base64Key = process.env.BASE_64_Key;
console.log({ base64Key });
const key = Buffer.from(base64Key, "base64"); // 32 bytes

app.use(bodyParser.json());

// AES-GCM decryption function
async function decryptField(ciphertextB64, ivB64) {
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const iv = Buffer.from(ivB64, "base64");

  // Split auth tag (last 16 bytes) from actual ciphertext
  const tag = ciphertext.slice(-16);
  const data = ciphertext.slice(0, -16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  return decrypted.toString("utf-8");
}

// Endpoint to decrypt fields
app.post("/decrypt", async (req, res) => {
  try {
    const encryptedFields = req.body;
    const decrypted = {};
    for (const field in encryptedFields) {
      const { ciphertext, iv } = encryptedFields[field];
      console.log({ ciphertext, iv });
      decrypted[field] = await decryptField(ciphertext, iv);
    }
    console.log({ decrypted });
    res.json({ decrypted });
  } catch (error) {
    console.error("Decryption failed:", error);
    res.status(500).json({ error: "Decryption error" });
  }
});

app.listen(PORT, () => {
  console.log(`DECRYPTION server listening on http://localhost:${PORT}`);
});
