const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');
const { verifyToken, checkRole } = require('../Middleware/auth');

//  Admin Route: Get all events (approved, pending, declined)
router.get('/all', verifyToken, checkRole(["System Admin"]), eventController.getAllEventsForAdmin);

//  Public Routes
router.get('/', eventController.getAllEvents);                  
router.get('/:id', eventController.getEventById);              

//  Organizer Routes
router.post('/', verifyToken, eventController.createEvent);
router.get('/analytics/my-events', verifyToken, eventController.getEventAnalytics);

//  Admin Routes
router.put('/:id/status', verifyToken, checkRole(["System Admin"]), eventController.updateEventStatus);

//  Organizer or Admin Routes
router.put('/:id', verifyToken, eventController.updateEvent);
router.delete('/:id', verifyToken, eventController.deleteEvent);

module.exports = router;
