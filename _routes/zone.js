const express = require('express');
const router = express.Router();

const zoneCtrl = require('../_controllers/zone');

router.get('/', zoneCtrl.getAll);
router.post('/', zoneCtrl.create);
router.post('/many', zoneCtrl.createMany);

module.exports = router;