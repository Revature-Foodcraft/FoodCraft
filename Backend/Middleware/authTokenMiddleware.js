import jwt from "jsonwebtoken"
import { logger } from "../util/logger.js"
import dotenv from 'dotenv'

dotenv.config({ override: true })

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: "Message Forbidden Access: No Token" })
    } else {
        const tokenDetail = await decodeJWT(token)

        if (tokenDetail) {
            req.locals = { tokenDetail: tokenDetail }
            next()
        } else {
            res.status(403).json({ message: "Forbidden Access: Invalid Token" })
        }
    }
}

async function decodeJWT(token) {
    try {
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)
        return decodedToken
    } catch (error) {
        logger.error(error)
        return null
    }
}