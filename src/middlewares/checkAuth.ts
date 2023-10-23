import { NextFunction, Request, Response } from "express";
import HTTPCode from "../utils/enums/HTTPCode";
import jwt from "jsonwebtoken";
import 'dotenv/config';

async function checkAuth(req: Request, res: Response, next: NextFunction)
{
	const token:string|undefined = req.headers.authorization as string|undefined  
	if (!token){
		return res.status(HTTPCode.UNAUTHORIZED).json({error: "No token provided"});
	}

	try{
		const decodedToken:any = jwt.verify(token, process.env.SECRET_KEY as string);
		const userId:string = decodedToken.userId;

		res.locals.userId = userId;
		next();
	} catch (err){
		return res.status(HTTPCode.UNAUTHORIZED).json({error: "Invalid token"});
	} 
}

export default checkAuth;