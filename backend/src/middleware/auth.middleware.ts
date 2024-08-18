const { user } = require('../db/schema');
import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const { ApiError } = require( '../utils/ApiError');
const {db} = require('../db/drizzle')
import dotenv from 'dotenv';
dotenv.config();

interface User {
  id: string;
}

export const verifyJWT = async (req: any, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }


    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new ApiError(500, "Server configuration error: ACCESS_TOKEN_SECRET not defined");
    }

    const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;

    // Fetch the user from the database
    const fetchedUser = await db.select().from(user).where(eq(user.id, decodedToken.id));


    if (!fetchedUser || fetchedUser.length === 0) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = fetchedUser[0]; // Access the first user if fetchedUser is an array
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    next(new ApiError(401, error?.message || "Invalid access token"));
  }
};
