import "dotenv/config"
import jwt from "jsonwebtoken"

const generateToken = (key: any): string => {
    try {
        const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY
        const token: string = jwt.sign({key}, JWT_SECRET_KEY)
        return token
    } catch (error) {
        throw error
    }
}

const verifyToken = (token: string) => {
    try {
        const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY
        const email: any = jwt.verify(token, JWT_SECRET_KEY)

        return [true, email]
    } catch (error) {
        throw [false, null]
    }
}

export const tokenManager = {
    generateToken,
    verifyToken
}