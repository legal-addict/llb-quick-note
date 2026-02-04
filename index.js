import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Razorpay keys from Render ENV
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Health check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// CREATE ORDER
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// VERIFY PAYMENT
app.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      noteName,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        url: `https://LABOUR LAW AND INDUSTRIAL RELATIONS- I.com/notes/${encodeURIComponent(noteName)}.pdf`,
      });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// 🔑 REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
