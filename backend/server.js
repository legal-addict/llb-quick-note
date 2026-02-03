import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Razorpay instance (KEYS ONLY HERE)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// CREATE ORDER
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    res.json({
      key: process.env.RAZORPAY_KEY_ID, // send key safely
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
      username,
      noteName,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // SUCCESS → redirect to PDF or note
      res.json({
        success: true,
        url: `https://your-site.com/notes/${noteName}.pdf`,
      });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
