import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const { eq, or, and } = require('drizzle-orm');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { uploadOnCloudinary } = require('../utils/uploadOnCloudinary');
const { db } = require('../db/drizzle');
const {chat, user} = require('../db/schema')
import { alias } from 'drizzle-orm/pg-core';


const createChat = asyncHandler(async (req:Request, res:Response) => {

    const {content, senderId, receiverId} = req.body;

    const s  = await db.insert(chat).values({content, senderId, receiverId}).returning({id:chat.id});
    console.log(s);
    
    const fetchedChat = await db.select().from(chat).where(eq(chat.id, s[0].id))
    console.log(fetchedChat);
    
    return res.status(200).json(new ApiResponse(200, fetchedChat, "Chat created successfully"))
})

const createChatWithFile = asyncHandler(async (req: Request, res: Response) => {
  const { content, senderId, receiverId } = req.body;
  console.log('level 1');
  
  if (!senderId || !receiverId) {
      throw new ApiError(400, "senderId and receiverId are required");
  }

  const fileLocalPath = req.file?.path;
  console.log('level 2');
  
  if (!fileLocalPath) {
      throw new ApiError(400, "File not found");
  }

  console.log("senderId:", senderId, "receiverId:", receiverId);
  console.log('level 3');
  
  const file = await uploadOnCloudinary(fileLocalPath);

  const s = await db.insert(chat).values({
      content,
      senderId,
      receiverId,
      file: file.url,
      isFile: true
  }).returning({ id: chat.id });
  console.log('level 4');
  
  const fetchedChat = await db.select().from(chat).where(eq(chat.id, s[0].id));
  return res.status(200).json(new ApiResponse(200, fetchedChat, "Chat created successfully"));
});
const getChat = asyncHandler(async (req:Request, res:Response) => {
    const {senderId, receiverId} = req.body;
    console.log(senderId, receiverId);
    
    if (!senderId || !receiverId) {
        throw new ApiError(400, "senderId and receiverId not found");
    }


    const senderAlias = alias(user, 'sender');
const receiverAlias = alias(user, 'receiver');

const fetchedChats = await db
  .select({
    chatId: chat.id,
    content: chat.content,
    file: chat.file,
    isRead: chat.isRead,
    createdAt: chat.createdAt,
    senderId: chat.senderId,
    receiverId: chat.receiverId,
    senderUsername: senderAlias.username,
    senderAvatar: senderAlias.avatar,
    receiverUsername: receiverAlias.username,
    receiverAvatar: receiverAlias.avatar,
  })
  .from(chat)
  .leftJoin(senderAlias, eq(chat.senderId, senderAlias.id)) // Left join to get sender information
  .leftJoin(receiverAlias, eq(chat.receiverId, receiverAlias.id)) // Left join to get receiver information
  .where(
    or(
      and(eq(chat.senderId, senderId), eq(chat.receiverId, receiverId)),
      and(eq(chat.senderId, receiverId), eq(chat.receiverId, senderId))
    )
  )
  .orderBy(chat.createdAt, 'asc');
    
    return res.status(200).json(new ApiResponse(200, fetchedChats, "chat fetched successfuly"))  
})

const chatRead = asyncHandler(async (req:Request, res:Response) => {
  const {chatId} = req.body;

  const updatedChat = await db.update(chat).set({isRead:true}).where(eq(chat.id,chatId))

  res.status(200).json(new ApiResponse(200, updatedChat, "chat updated successfully" ))
})

export{
    createChat,
    createChatWithFile,
    getChat,
    chatRead

}