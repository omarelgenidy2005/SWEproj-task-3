console.log("Booking Routes Loaded");   
const express = require("express");
const bookingController = require("../Controllers/bookingController");
const { verifyToken, checkRole } = require("../Middleware/auth");
const router = express.Router();

router.post("/", verifyToken, bookingController.createBooking);

router.delete("/:id", verifyToken, bookingController.cancelBooking);

  router.get("/:id", verifyToken, bookingController.getBookingById);
module.exports = router;