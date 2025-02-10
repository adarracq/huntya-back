const express = require('express');
const router = express.Router();

const convCtrl = require('../_controllers/conv');
const multer = require('../_middlewares/multer-config');

router.get('/senderId=:senderId&receiverId=:receiverId', convCtrl.getConv);
router.get('/user/:userId', convCtrl.getUserConvs);
router.get('/read/:convId', convCtrl.readConv);
router.post('/message', convCtrl.sendMessage);

module.exports = router;