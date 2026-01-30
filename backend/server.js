import express from "express";
import cors from "cors";
import Razorpay from "razorpay"; // Don't forget this import!

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: "https://legal-addict.github.io",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Pre-flight OPTIONS request for your frontend domain
app.options("https://legal-addict.github.io", cors());

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_S7yra6spfeeO7h",
  key_secret: "v7CFWcdMu8ndbcsMCY6PHvuN"
});

// Route to create order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // amount in paise
      currency: "INR"
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Send order details to frontend
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
