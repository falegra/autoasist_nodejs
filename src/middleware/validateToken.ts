import jwt from "jsonwebtoken"

export const validateToken = (req: any, res: any, next: any) => {
    const token: string = req.headers("x-token")

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: "Token do not exists"
        })
    }

    try {
        const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY
        const key = jwt.verify(token, JWT_SECRET_KEY)

        req.key = key
        next()
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Invalid token"
        })
    }
}