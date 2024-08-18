import { Request, Response, NextFunction } from "express";


const asyncHandler = (reqHandler:Function) => {
    return (req:Request, res:Response, next:NextFunction) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }