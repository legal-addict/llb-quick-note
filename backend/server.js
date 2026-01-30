import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "https://legal-addict.github.io", // for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// VERY IMPORTANT
app.options("https://legal-addict.github.io", cors());

const razorpay = new Razorpay({
  key_id: "rzp_test_S7yra6spfeeO7h",
      key_secret: "v7CFWcdMu8ndbcsMCY6PHvuN" // 🔒 NEVER expose this in frontend
});
app.post("/create-order", async (req, res) => {
  res.json({
    id: "test_order",
    amount: req.body.amount
  });
});

    res.json(order);
  try {
  // code here
} catch (err) {
  console.error(err);
}

    res.status(500).json({ error: err.message });
  }
});

app.listen(5050, () =>
  console.log("Server running on port 5050")
);
