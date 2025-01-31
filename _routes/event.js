const express = require('express');
const router = express.Router();

const eventCtrl = require('../_controllers/event');
const multer = require('../_middlewares/multer-config');

router.get('/:email', eventCtrl.getEventsByUserEmail);
router.get('/id/:id', eventCtrl.getEventById);
router.post('/', eventCtrl.createEvent);
router.put('/:id', eventCtrl.updateEvent);
router.delete('/:id', eventCtrl.deleteEvent);

module.exports = router;