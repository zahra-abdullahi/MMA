require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Secure API key
const cors = require("cors");

const app = express();
app.use(express.json());

// Allow CORS only from frontend domain
app.use(cors({ origin: "http://localhost:3000" })); 

// Define prices for games
const prices = {
    game1: 2000, // $20 in cents
    game2: 2500  // $25 in cents
};

// Create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
    const { game, quantity } = req.body;

    // Validate game selection
    if (!prices[game]) {
        return res.status(400).json({ error: "Invalid game selection" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: game },
                        unit_amount: prices[game],
                    },
                    quantity: quantity,
                }
            ],
            mode: "payment",
            success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Success route
app.get("/success", (req, res) => {
    const sessionId = req.query.session_id;
    res.send(`Payment successful! Session ID: ${sessionId}`);
});

// Cancel route
app.get("/cancel", (req, res) => {
    res.send("Payment canceled.");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
