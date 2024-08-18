import { Request, response, Response } from 'express';
const { eq, or } = require('drizzle-orm');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { db } = require('../db/drizzle');
const {friend, user} = require('../db/schema')
import { alias } from 'drizzle-orm/mysql-core';

const friendList = asyncHandler(async(req:Request, res:Response)=>{
    const {userId} = req.body;

    
    if (!userId) {
      return res.status(400).json(new ApiResponse(400, null, "UserId is required"));
    }



    const friendUser = alias(user, 'friendUser');
    const currentUser = alias(user, 'currentUser');



    const fetchedFriends = await db
        .select({
            friendId: friend.freindId, // Note: this should be 'friendId' if you fix the typo in your schema
            friendUsername: friendUser.username,
            friendAvatar: friendUser.avatar,
            userId: friend.userId,
            userUsername: currentUser.username,
            userAvatar: currentUser.avatar,
            userEmail: currentUser.email,
            friendEmail: friendUser.email,
        })
        .from(friend)
        .leftJoin(friendUser, eq(friend.freindId, friendUser.id))
        .leftJoin(currentUser, eq(friend.userId, currentUser.id))
        .where(eq(friend.userId, userId));

      return res.status(200).json(new ApiResponse(200, fetchedFriends,"User Friends Fetched"))
} );

const createFriend = asyncHandler(async (req:any, res:any) => {
  const {userId,freindId }= req.body;

  const createFriend = await db.insert(friend).values({userId,freindId}).returning({id:friend.id});

  const friendUser = alias(user, 'friendUser');
  const currentUser = alias(user, 'currentUser');



  const fetchedFriends = await db
      .select({
          friendId: friend.freindId,
          friendUsername: friendUser.username,
          friendAvatar: friendUser.avatar,
          userId: friend.userId,
          userUsername: currentUser.username,
          userAvatar: currentUser.avatar,
          userEmail: currentUser.email,
          friendEmail: friendUser.email,
      })
      .from(friend)
      .leftJoin(friendUser, eq(friend.freindId, friendUser.id))
      .leftJoin(currentUser, eq(friend.userId, currentUser.id))
      .where(eq(friend.userId, userId));
    return res.status(200).json(new ApiResponse(200, fetchedFriends,"User Friends Fetched"))
})

export{
    friendList,
    createFriend
}