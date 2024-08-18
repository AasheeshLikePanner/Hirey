const { friendList, createFriend } = require("../controllers/friendController");
import { Router } from "express";
const { verifyJWT } = require("../middleware/auth.middleware");

const friendRouter = Router()

friendRouter.route('/friend-list').post( verifyJWT, friendList)

friendRouter.route('/create-friend').post(verifyJWT, createFriend);

module.exports = friendRouter;