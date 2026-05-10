const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/savanna-spice";
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT || "emmauelharo2020@gmail.com";

const smtpConfig = {
  host: process.env.EMAIL_HOST || "",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
};

const isEmailConfigured = Boolean(
  smtpConfig.host && smtpConfig.auth.user && smtpConfig.auth.pass
);

const transporter = nodemailer.createTransport(smtpConfig);
let emailVerified = false;

const verifyEmailTransport = async () => {
  if (!isEmailConfigured) {
    console.warn("Email is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env.");
    return;
  }

  try {
    await transporter.verify();
    emailVerified = true;
    console.log("Email transport verified successfully.");
  } catch (error) {
    console.warn("Email transport verification failed:", error.message);
  }
};

verifyEmailTransport();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

app.post("/api/bookings", async (req, res) => {
  try {
    console.log("📨 Booking request received:", {
      body: req.body,
      contentType: req.headers["content-type"],
    });

    const { name, phone, date } = req.body;

    if (!name || !phone || !date) {
      console.log("❌ Validation failed. Received:", { name, phone, date });
      return res.status(400).json({ error: "Name, phone, and date are required." });
    }

    console.log("✅ Booking validated:", { name, phone, date });

    const booking = new Booking({ name, phone, date });
    await booking.save();
    console.log("💾 Booking saved to MongoDB:", booking._id);

    let emailStatus = "skipped";
    if (isEmailConfigured && emailVerified) {
      const mailOptions = {
        from: smtpConfig.auth.user,
        to: EMAIL_RECIPIENT,
        subject: "New Booking Request from Savanna Spice",
        text: `New booking details:\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nReceived: ${new Date().toLocaleString()}`,
      };

      await transporter.sendMail(mailOptions);
      emailStatus = "sent";
      console.log("📧 Email sent to", EMAIL_RECIPIENT);
    } else if (isEmailConfigured && !emailVerified) {
      emailStatus = "not verified";
      console.log("⚠️  Email not verified");
    }

    console.log("✅ Response sent with emailStatus:", emailStatus);
    return res.json({
      message: "Booking saved successfully.",
      emailStatus,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: "Unable to save booking. Please try again later." });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    console.error("Booking list error:", error);
    return res.status(500).json({ error: "Unable to load bookings." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      if (!isEmailConfigured) {
        console.warn("Warning: Email transport is not configured. Bookings will be saved, but email will not be sent until SMTP settings are provided.");
      }
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
