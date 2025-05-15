const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");
const eventController = require("../Controllers/eventController");



const { verifyToken, checkRole } = require("../Middleware/auth");

//  Public Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/forgetPassword", userController.forgetPassword);

// Authenticated User Routes (API 5 & 6)
router
.route("/users/profile")
  .get(verifyToken, userController.getProfile)          // API 5
  .put(verifyToken, userController.updateProfile);      // API 6

// Admin-Only Routes (API 7 & 8)
router
  .route("/users/:id")
  .get(verifyToken, checkRole(["System Admin"]), userController.getUserById)   // API 7
  .put(verifyToken, checkRole(["System Admin"]), userController.updateUserRole) // API 8
 .delete( verifyToken, checkRole(["System Admin"]), userController.deleteUser);
//  Admin route you already had
router.get("/users", verifyToken, checkRole(["System Admin"]), userController.getAllUsers);

router.get(
    "/bookings",
    verifyToken,
    checkRole(["Standard User"]),
    bookingController.getUserBookings
  );

  router.get(
    "/events/analytics",
    verifyToken,
    checkRole(["Organizer"]),
    eventController.getEventAnalytics
  );

  router.get(
    "/events",
    verifyToken,
    checkRole(["Organizer"]),
    eventController.getOrganizerEvents
  );



  
  
  
module.exports = router;



//