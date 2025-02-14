const express = require('express');
const router = express.Router();
const userCtrl = require('../_controllers/user');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./");
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(" ").join("_").split(".")[0];
      const extension = file.mimetype.split("/")[1];
      callback(null, `/_upload/images/${name}-${Date.now()}.${extension}`);
    },
  });
const upload = multer({ storage: storage });

router.post('/loginOrSignup', userCtrl.loginOrSignup);
router.post('/code', userCtrl.verifyEmailCode);
router.get('/:email', userCtrl.getUserByEmail);
router.get('/id/:id', userCtrl.getUserById);
router.get('/agents/all', userCtrl.getAllAgents);
router.put('/', userCtrl.updateUser);
router.put('/picture/:email', upload.single("image"), userCtrl.uploadPicture);

module.exports = router;