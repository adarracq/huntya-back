const express = require('express');
const router = express.Router();
const userCtrl = require('../_controllers/user');
const multer = require("multer");
const auth = require('../_middlewares/auth');

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
router.get('/id/:id',auth, userCtrl.getUserById);
router.get('/agents/all',auth, userCtrl.getAllAgents);
router.put('/',auth, userCtrl.updateUser);
router.put('/picture/:email', upload.single("image"),auth, userCtrl.uploadPicture);

module.exports = router;