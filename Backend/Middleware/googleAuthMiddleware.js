import {OAuth2Client} from "google-auth-library";
import dotenv from "dotenv"
import { logger } from "../util/logger.js";

dotenv.config({override:true})
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function authenticateGoogleToken(req,res,next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({message:"Missing Token"})
    }else{
        const verifiedToken = await verifyToken(token)

        logger.info(`Decoded token: ${JSON.stringify(verifiedToken)}`);
        if(verifiedToken){
            req.local = verifiedToken;
            next()
        }else{
            res.status(403).json({ message: "Forbidden Access: Invalid Token" })
        }
    }
}

async function verifyToken(token) {
    try{
        const ticket = await client.verifyIdToken({
            idToken:token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        
        return ticket.getPayload()
    }catch(err){
        logger.error(err)
        return null
    }
}