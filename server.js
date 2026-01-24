require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// 🔥 HARD OVERRIDE CORS (DEV ONLY)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post("/create-order", async (req, res) => {
  try {
    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id: "rzp_live_S5B4eUZwWKGBKT",
      key_secret: "Eyb517sgZRLx8cqwwaNPFtXJ"
    });

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR"
    });

    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.listen(5001, () => {
  console.log("✅ Backend running on http://localhost:5001");
});
