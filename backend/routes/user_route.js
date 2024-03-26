const express=require('express')
const usercontroller=require("../controller/usercontroller")
const router=express.Router()
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' +file.originalname;
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const upload = multer({ storage: storage })
router.post('/signup',usercontroller.signUp);
router.post('/login',usercontroller.login);
router.post('/upload',upload.single('file'),usercontroller.upload);
router.post('/generateChart',usercontroller.generateChart);
module.exports=router