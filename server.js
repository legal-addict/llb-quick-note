import Razorpay from "razorpay";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_S7yra6spfeeO7h",
      key_secret: "v7CFWcdMu8ndbcsMCY6PHvuN" // 🔒 NEVER expose this in frontend
});

app.post("/create-order", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const order = await razorpay.orders.create({
      amount: Number(req.body.amount),
      currency: "INR",
    });

    console.log("ORDER CREATED:", order.id);
    res.status(200).json(order);

  } catch (err) {
    console.error("RAZORPAY ERROR FULL:", err);
    res.status(500).json({
      error: err.message,
      details: err.error || err
    });
  }
});
app.listen(5050, () =>
  console.log("Server running on port 5050")
);
