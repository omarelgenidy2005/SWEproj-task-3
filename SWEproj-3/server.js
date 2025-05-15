require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./Routes/userRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const eventRoutes = require('./Routes/eventRoutes');

app.use('/api/v1/events', eventRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Default test route
app.get("/", (req, res) => {
  res.send("API is working ");
});

// MongoDB Connection & Server Startup
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
