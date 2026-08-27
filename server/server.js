const dotenv = require("dotenv");
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  const dns = require("dns");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const aiRoutes = require("./routes/AI");

const port = process.env.PORT || 4000;

// Database connection
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://edufy-flax.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman aur direct browser requests allow
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connect Cloudinary
cloudinaryConnect();

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/ai", aiRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("welcome to my server EDUFY");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});