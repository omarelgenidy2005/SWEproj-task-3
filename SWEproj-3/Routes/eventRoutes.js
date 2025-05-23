const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');
const { verifyToken, checkRole } = require('../Middleware/auth');

// Public routes
router.get('/', eventController.getAllEvents);

// Organizer-only routes
router.get('/my-events', verifyToken, checkRole(["Organizer"]), eventController.getOrganizerEvents);
router.get('/analytics/my-events', verifyToken, checkRole(["Organizer"]), eventController.getEventAnalytics);
router.post('/', verifyToken, checkRole(["Organizer"]), eventController.createEvent);

// Admin routes
router.get('/all', verifyToken, checkRole(["System Admin"]), eventController.getAllEventsForAdmin);
router.put('/:id/status', verifyToken, checkRole(["System Admin"]), eventController.updateEventStatus);

// Shared routes
router.put('/:id', verifyToken, eventController.updateEvent);
router.delete('/:id', verifyToken, eventController.deleteEvent);

router.get('/:id', eventController.getEventById);

module.exports = router;
