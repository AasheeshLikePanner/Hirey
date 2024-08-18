const { createChat, createChatWithFile, getChat, chatRead } = require("../controllers/chatController");
import { Router } from "express";
const { upload } = require("../middleware/mutller.middleware");
const {verifyJWT} = require("../middleware/auth.middleware");

const chatRouter = Router()

chatRouter.route('/create-chat-with-file').post(verifyJWT,upload.single('file'), createChatWithFile)

chatRouter.route('/create-chat').post(verifyJWT, createChat);

chatRouter.route('/get-chat').post(verifyJWT, getChat )

chatRouter.route('/set-chat-read').post(verifyJWT, chatRead )


module.exports = chatRouter;
