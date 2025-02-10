const express = require('express');
const asyncHandler = require('express-async-handler');
const controller = require('../_controllers/message');
const router = express.Router();
//const passport = require('passport');
//const auth = passport.authenticate('jwt', {session: false});

router.post('/message', asyncHandler(controller.addMessage));
router.post('/messages', asyncHandler(controller.getMessages));
router.post('convs', asyncHandler(controller.getConvs));

module.exports = router;