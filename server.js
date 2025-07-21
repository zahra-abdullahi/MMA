require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const qr = require('qr-image');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    const { game, quantity } = req.body;

    if (!game || quantity < 1 || quantity > 20) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: game },
                    unit_amount: 1000,
                },
                quantity,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'https://mma-wsuu.onrender.com'}/success.html`,
            cancel_url: `${process.env.CLIENT_URL || 'https://mma-wsuu.onrender.com'}/tickets.html`,
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error('❌ Stripe error:', err);
        res.status(500).json({ error: 'Stripe checkout failed' });
    }
});

// QR Email Ticket Sender
app.post('/send-ticket', async (req, res) => {
    const { email, game, quantity } = req.body;

    if (!email || !game || quantity < 1 || quantity > 20) {
        return res.status(400).json({ error: 'Invalid ticket request' });
    }

    try {
        const qrData = `Game: ${game}\nTickets: ${quantity}`;
        const qrCodeImage = qr.imageSync(qrData, { type: 'png' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Mile-HI Tickets" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎟️ Your Ticket(s) for ${game}`,
            html: `
                <h2>Thank you for purchasing ${quantity} ticket(s) for <strong>${game}</strong>!</h2>
                <p>Show this QR code at the entrance.</p>
            `,
            attachments: [{
                filename: 'ticket.png',
                content: qrCodeImage,
                contentType: 'image/png',
            }],
        });

        console.log(`✅ Email sent to ${email} for ${game}`);
        res.status(200).json({ message: 'Ticket email sent' });
    } catch (err) {
        console.error('❌ Email error:', err);
        res.status(500).json({ error: err.message || 'Failed to send ticket email' });
    }
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
