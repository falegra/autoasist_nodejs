import "dotenv/config";
import jwt from "jsonwebtoken";
const generateToken = (key) => {
    try {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ key }, JWT_SECRET_KEY);
        return token;
    }
    catch (error) {
        throw error;
    }
};
const verifyToken = (token) => {
    try {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const email = jwt.verify(token, JWT_SECRET_KEY);
        return [true, email];
    }
    catch (error) {
        throw [false, null];
    }
};
export const tokenManager = {
    generateToken,
    verifyToken
};
