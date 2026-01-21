require('dotenv').config();

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();   // ✅ app defined HERE

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: rzp_live_S5B4eUZwWKGBKT,
  key_secret: Eyb517sgZRLx8cqwwaNPFtXJ
});

app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("KEY ID:", process.env.KEY_ID); // debug

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      payment_capture: 1
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.KEY_ID
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});

