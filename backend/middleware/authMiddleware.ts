import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-sizzle-key";

//? Extend the Express Request interface to include userId
export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token= req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({error: "No token, authorization denied."});
    }

    try {
        //? Be sure to verify token
        const decoded = jwt.verify(token, JWT_SECRET) as {userId: string};
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({error: "Token is not valid"});
    }
};