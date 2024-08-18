const { loginUser, registerUser,CurrentUser, getuser } = require("../controllers/userController.ts");
import { Router } from "express";
const { verifyJWT } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/mutller.middleware");



const router = Router();

router.route('/login').post(loginUser)

router.route("/register").post(upload.single("avatar"), registerUser)

router.route('/current-user').get( verifyJWT,CurrentUser)

router.route('/getuser').post(verifyJWT,getuser)

module.exports = router ;