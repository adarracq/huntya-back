const express = require('express');
const router = express.Router();

const eventCtrl = require('../_controllers/event');
const auth = require('../_middlewares/auth');

router.get('/:email',auth, eventCtrl.getEventsByUserEmail);
router.get('/id/:id',auth, eventCtrl.getEventById);
router.post('/',auth, eventCtrl.createEvent);
router.put('/:id',auth, eventCtrl.updateEvent);
router.delete('/:id',auth, eventCtrl.deleteEvent);

module.exports = router;