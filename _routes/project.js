const express = require('express');
const router = express.Router();

const auth = require('../_middlewares/auth');

const projectCtrl = require('../_controllers/project');

router.get('/',auth, projectCtrl.getAllProjects);
router.post('/',auth, projectCtrl.createProject);
router.get('/:id',auth, projectCtrl.getOneProject);
router.get('/user/:userId',auth, projectCtrl.getAllProjectsByUser);
router.post('/zones', auth, projectCtrl.getProjectsInZones);
router.put('/:id',auth, projectCtrl.modifyProject);
router.delete('/:id',auth, projectCtrl.deleteProject);

module.exports = router;