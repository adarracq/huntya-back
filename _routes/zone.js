const express = require('express');
const router = express.Router();
const auth = require('../_middlewares/auth');

const zoneCtrl = require('../_controllers/zone');

router.get('/',auth, zoneCtrl.getAll);
router.put('/many',auth, zoneCtrl.getMany);
router.post('/',auth, zoneCtrl.create);
router.post('/many',auth, zoneCtrl.createMany);
router.put('/coords',auth, zoneCtrl.getZoneFromCoords);
router.put('/add',auth, zoneCtrl.addCAP);

module.exports = router;