import { Request, Response } from "express";
import HTTPCode from "../../utils/enums/HTTPCode";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

async function register(req: Request, res: Response)
{
	let body = req.body;

    try{
        const{user, error} = await req.app.locals.database.getUser(req.body.email);
        if (error){
            return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error});
        } 

        if (user){
            return res.status(HTTPCode.NOT_FOUND).json({error: "User already exists"});
        }
    } catch (err){
        return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error: err});
    } 

    try{ 
        const hashedPassword = await bcrypt.hash(body.password, 10);
        let {user, error} = await req.app.locals.database.createUser(body.email, hashedPassword);

        if(error){ 
            res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error})
        } else {  
            res.status(HTTPCode.CREATED).json({user});
        }
    } catch (err){
        res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error: err});
    }  
}

async function login(req: Request, res: Response)
{
    try{
        const{user, error} = await req.app.locals.database.getUser(req.body.email);
        if (error){
            return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error});
        } 

        if (!user||!user.email){
            return res.status(HTTPCode.NOT_FOUND).json({error: "User not found"});
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch){
            return res.status(HTTPCode.UNAUTHORIZED).json({error: "Invalid password"});
        }

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY as string, {expiresIn: process.env.TOKEN_EXP as string});

        res.status(HTTPCode.OK).json({userId: user._id, token: token});
    } catch (err){
        res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error: err});
    }  
}

export default {
	register,
	login,
}