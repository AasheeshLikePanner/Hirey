import { Request, Response } from 'express';
import  bcrypt from 'bcrypt';
import { exit } from 'process';
import { log } from 'console';
const jwt = require('jsonwebtoken');
const { eq, or } = require('drizzle-orm');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { uploadOnCloudinary } = require('../utils/uploadOnCloudinary');
const { db } = require('../db/drizzle');
const { user } = require('../db/schema');



function generateAccessToken(id:string, email:string, username:string){
    console.log('in accessToken');
    
    return jwt.sign({
        id,
        email,
        username
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

function generateRefreshToken(id:string, email:string,username:string){
    console.log('in refreshToken');

    return jwt.sign({
        id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        } 
    )
}

const genrateAccessTokenAndRefreshToken = async(id:string, email:string, username:string) => {
    try {
        const [fetchedUser] = await db.select().from(user).where(eq(user.id, id));
        console.log('level 1');
        
        if (!fetchedUser) {
            console.log('user not found');
            
            throw new ApiError(404, 'User not found');
        }
        console.log('level 2');
        
        const accessToken = generateAccessToken(id, email, username);
        const refreshToken = generateRefreshToken(id, email, username);
        console.log('in update');
        
        await db.update(user)
        .set({refreshToken} as any)
        .where(eq(user.id, id));
        console.log('update happened');
        
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating refresh and acess token")
    }
}


const getuser = asyncHandler(async (req:Request, res:Response) => {

    const {username} = req.body;

    if(!username){
        throw new ApiError(500, 'frontend did not send credentials to the server')
    }
    
    const fetchedUser = await db.select().from(user).where(eq(user.username, username))

    if (!fetchedUser) {
        throw new ApiError(404, 'user not found')
    }
    return res.status(200).json(new ApiResponse(200, fetchedUser[0], "User fetched successfully"))

})

const registerUser = asyncHandler(async (req:Request, res:Response) => {

    const {username, email, password} = req.body;

    if(!username || !email || !password){
        throw new ApiError(400, 'please send the full details')
    }
    const existedUser = await db.select().from(user).where(eq(user.email, email))
                
    if (existedUser.length > 0) {
        
        throw new ApiResponse(400, "user with username or email exist.")    
    }
    
    const avatarLocalPath = req.file.path
    
    if(!avatarLocalPath){
        
        throw new ApiError(400, "Avatar file is required")
    }
    
    
    const avatar  = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        
        throw new ApiError(400, "Avatar file is required")
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const intesertedUser = await db.insert(user).values({username, email, password:hashedPassword,avatar:avatar.url })
    const fetchedUser = await db.select().from(user).where(eq(user.email, email)).limit(1);

    if (!fetchedUser) {
        throw new ApiError(404, 'user not found')
    }
    const fetchUser = fetchedUser[0]; 

    return res.status(200).json(new ApiResponse(200,fetchUser , "User fetched successfully"))
})

const loginUser = asyncHandler(async (req:Request, res:Response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'email and password required for login');
    }


    const fetchUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    const fetchedUser = fetchUser[0];

    if (!fetchedUser) {
        throw new ApiError(400, "user does not exist");
    }
    console.log('fetched User',fetchedUser);
    
    const {accessToken, refreshToken} = await genrateAccessTokenAndRefreshToken(fetchedUser.id, fetchedUser.email, fetchedUser.username)


    const passCompare = bcrypt.compare(password, fetchedUser.password)

    if (passCompare) {
        return res.status(200)
        .cookie("accessToken",accessToken, {httpOnly:true,secure:false}) 
        .cookie("refreshToken", refreshToken, {httpOnly:true, secure:false})
        .json(new ApiResponse(200, fetchedUser, "User logined Successfully!"))
    }else throw new ApiError(404, 'user password is wrong')
})


const CurrentUser = asyncHandler(async(req:any,res:Response) => {
    const r = req.user;
    
    return  res
    .status(200)
    .json(new ApiResponse(
        200,
        r,
        "User fetched successfully"
    ))
})


export{
    getuser,
    registerUser,
    loginUser,
    CurrentUser
}

type GetUserRequestBody = {
    username?: string,
    email?: string,
    password?: string,
    avatar?: string,
    refreshToken?: string,
    accessToken?: string,
}