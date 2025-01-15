const express = require('express');
const router = express.Router();

const auth = require('../_middlewares/auth');
const multer = require('../_middlewares/multer-config');

const projectCtrl = require('../_controllers/project');

router.get('/', projectCtrl.getAllProjects);
router.post('/', multer, projectCtrl.createProject);
router.get('/:id', projectCtrl.getOneProject);
router.get('/user/:userId', projectCtrl.getAllProjectsByUser);
router.post('/zones', projectCtrl.getProjectsInZones);
router.put('/:id', multer, projectCtrl.modifyProject);
router.delete('/:id', projectCtrl.deleteProject);

module.exports = router;