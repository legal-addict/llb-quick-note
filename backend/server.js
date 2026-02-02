import "dotenv/config";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();

// Use Render’s PORT
const PORT = process.env.PORT || 5050;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const accessTokens = new Map();

const NOTES = {
  "LABOUR LAW AND INDUSTRIAL RELATIONS- I": "LABOUR-LAW-AND-INDUSTRIAL-RELATIONS.html",
  "LAW OF TORTS, MOTOR ACCIDENT CLAIMS AND CONSUMER PROTECTION": "LAW-OF-TORTS-MOTOR-ACCIDENT-CONSUMER-PROTECTION.html",
  "LAW OF CONTRACT AND SPECIFIC RELIEF": "LAW-OF-CONTRACT-AND-SPECIFIC-RELIEF.html",
  "LEGAL LANGUAGE": "LEGAL-LANGUAGE.html",
  "Practical Training - I Professional Ethics and Professional Accounting System": "PRACTICAL-TRAINING-I.html"
};

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR"
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, username, noteName } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  const token = crypto.randomBytes(32).toString("hex");
  accessTokens.set(token, {
    used: false,
    expires: Date.now() + 10 * 60 * 1000,
    username,
    noteName
  });

  // Full URL for frontend
  const backendUrl = process.env.BACKEND_URL || `https://backend-kxr2.onrender.com`;

  res.json({
    success: true,
    url: `${backendUrl}/secure-note?token=${token}`
  });
});

app.get("/secure-note", (req, res) => {
  const { token } = req.query;
  const data = accessTokens.get(token);
  if (!data) return res.status(403).send("Access denied");
  if (data.used || Date.now() > data.expires) return res.status(403).send("Link expired");

  data.used = true;

  const noteFile = NOTES[data.noteName];
  if (!noteFile) return res.status(404).send("Note not found");

  const filePath = path.join(__dirname, "notes", noteFile);
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(/\[USERNAME\]/g, data.username);
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
