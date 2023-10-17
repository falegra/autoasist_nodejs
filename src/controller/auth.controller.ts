import { googleModel } from "../models/google.model.js";
import { localModel } from "../models/local.model.js";
import { UserGoogle, UserLocal } from "../types.js";
import { generate_activation_code } from "../helpers/generate_activation_code.js";
import { encryptManager } from "../helpers/hash_password.js";
import { tokenManager } from "../helpers/tokenManager.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { save_referrals_id } from "../helpers/save_referrals_id.js";
import { referralsModel } from "../models/referrals.model.js";

const createGoogleUser = async (req: any, res: any) => {
    try {
        // const email: string = req.user._json.email
        // const name: string = req.user._json.name
        const {email, name} = req.user._json
        const referral_code: number = new Date().getTime()

        if(!await googleModel.existEmail(email)){
            const user: UserGoogle = {
                name,
                email,
                created_at: "",
                updated_at: "",
                deleted_at: "",
                accept: true,
                authorization: true,
                referral_code,
                number_of_referrals: 0
            }

            if(await googleModel.saveUser(user)){
                //envio un email de confirmacion
                const data = {
                    to: email,
                    subject: "Bienvenido",
                    text: "Bienvenido a nuestra plataforma"
                }
                await sendEmail.send(data)
            }
        }

        const token: string = tokenManager.generateToken(email)

        return res.status(200).json({
            email,
            token
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const createLocalUser = async (req: any, res: any) => {
    try {
        // const email: string = req.body.email
        // const hash_password: string = req.body.password
        // const accept_req: string = req.body.accept
        // const authorization_req: strin
        const {email, hash_password, accept_req, authorization_req} = req.body
        const referral_code: number = new Date().getTime()
        const activation_code: number = generate_activation_code()

        const name: string = req.body.name || ""
        const created_at: string = req.body.created_at || ""
        const updated_at: string = req.body.updated_at || ""
        const deleted_at: string = req.body.deleted_at || ""

        if(accept_req === "on" && authorization_req === "on"){
            const accept: boolean = true
            const authorization: boolean = true
            const activate: boolean = true
            const number_of_referrals: number = 0

            if(await googleModel.existEmail(email) || await localModel.existEmail(email)){
                return res.status(406).json({
                    msg: "El email ya está en uso"
                })
            }

            const password: string = await encryptManager.encryptPassword(hash_password)

            let user: UserLocal = {
                name,
                email,
                password,
                created_at,
                updated_at,
                deleted_at,
                accept,
                authorization,
                referral_code,
                activation_code,
                activate,
                number_of_referrals
            }

            if(await localModel.saveUser(user)){
                //envio un email de confirmacion
                const data = {
                    to: email,
                    subject: "Bienvenido",
                    text: `Su código de activación es ${activation_code}`
                }
                await sendEmail.send(data)
            }

            return res.status(200).json({
                email
            })
        }
        else{
            return res.status(400).json({
                msg: "El campo pólitica de privacidad debe de estar marcado"
            })
        }
    } catch (error) {
        return res.status(400).json(error)
    }
}

const confirmActivationCode = async (req: any, res: any) => {
    try {
        const activation_code: number = req.body.activation_code
        const [valid, email] = await localModel.confirmActivationCode(activation_code)

        if(valid === 0){
            return res.status(404).json({
                msg: "Código no válido"
            })
        }
        else if(valid === 1){
            return res.status(200).json({
                msg: "La cuenta estaba activada"
            })
        }
        else{
            //genero el token
            const token: string = tokenManager.generateToken(email)

            return res.status(200).json({
                msg: "Se activo la cuento correctamente",
                token
            })
        }

    } catch (error) {
        return res.status(400).json(error)
    }
}

const login = async (req: any, res: any) => {
    try {
        // const email: string = req.body.email
        // const password: string = req.body.password
        const {email, password} = req.body

        if(!await localModel.existEmail(email)){
            return res.status(404).json({
                msg: "Este email no está registrado"
            })
        }

        const activate: number = await localModel.verifyActivateAccount(email)

        if(activate !== 1){
            return res.status(403).json({
                msg: "Debe de activar la cuenta"
            })
        }

        let db_password: any = await localModel.getUser("password", "email", email)
        db_password = db_password.password

        const valid: boolean = await encryptManager.comparePassword(password, db_password)

        if(!valid){
            return res.status(400).json({
                msg: "El password no es correcto"
            })
        }

        const token: string = tokenManager.generateToken(email)

        return res.status(200).json({
            msg: "Password correcto",
            token
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const glForgotPassword = async (req: any, res: any) => {
    try {
        const email: string = req.body.email
        const token: string = tokenManager.generateToken(email)
        const link: string = `http://url.com/del/front-end/${token}`

        //envio un email para enviar el link de cambio de clave
        const data = {
            to: email,
            subject: "Cambio de clave",
            text: `Éste es su link para el cambio de clave ${link}`
        }
        await sendEmail.send(data)

        return res.status(200).json({
            ok: true,
            link
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const ForgotPassword = async (req: any, res: any) => {
    try {
        // const email: string = req.key
        // const new_password: string = req.body.new_password
        // const re_new_password: string = req.body.re_new_password
        const {email, new_password, re_new_password} = req.body

        if(new_password !== re_new_password){
            return res.status(400).json({
                msg: "No coinciden las contraseñas"
            })
        }

        const password: string = await encryptManager.encryptPassword(new_password)

        await localModel.updatePassword(email, password)

        return res.status(200).json({
            msg: "Se cambió la contraseña correctamente"
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const changePassword = async (req: any, res: any) => {
    try {
        // const email: string = req.key
        // const new_password: string = req.body.new_password
        const {email, new_password} = req.body

        if(!await localModel.existEmail(email)){
            msg: "Éste email no está registrado"
        }

        const password: string = await encryptManager.encryptPassword(new_password)
        await localModel.updatePassword(email, password)

        return res.status(200).json({
            msg: "Cambió la contraseña correctamente"
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}

const localReferralRegistry = async (req: any, res: any) => {
    try {
        // const email: string = req.body.email
        // const password: string = req.body.password
        // const accept: string = req.body.accept
        // const authorization: string = req.body.authorization
        const {email, password, accept, authorization} = req.body
        const user_referral_code: number = Number(req.body.referral_code)
        const referral_code: number = new Date().getTime()
        const activation_code: number = generate_activation_code()

        const name: string = req.body.name || ""
        const created_at: string = req.body.created_at || ""
        const updated_at: string = req.body.updated_at || ""
        const deleted_at: string = req.body.deleted_at || ""

        if(!await localModel.verifyReferralCode(user_referral_code) && !await googleModel.verifyReferralCode(user_referral_code)){
            return res.status(404).json({
                msg: "Código de referido incorrecto"
            })
        }

        if(accept === "on" && authorization === "on"){
            if(await localModel.existEmail(email) || await googleModel.existEmail(email)){
                return res.status(406).json({
                    msg: "El email ya está en uso"
                })
            }

            let user: UserLocal = {
                name,
                email,
                password: await encryptManager.encryptPassword(password),
                created_at,
                updated_at,
                deleted_at,
                accept: true,
                authorization: true,
                referral_code,
                activation_code,
                activate: false,
                number_of_referrals: 0
            }

            if(await localModel.saveUser(user)){
                if(await localModel.verifyReferralCode(user_referral_code)){
                    await localModel.incrementReferral(user_referral_code)
                }
                else{
                    await googleModel.incrementReferral(user_referral_code)
                }

                const data = {
                    to: email,
                    subject: "Bienvendio",
                    text: `Su código de activación es ${activation_code}`
                }

                await sendEmail.send(data)

                const ids: any = await save_referrals_id(user_referral_code, referral_code)

                await referralsModel.saveIds(ids)
            }

            return res.status(200).json({
                email
            })
        }
        else{
            return res.status(400).json({
                msg: "El campo politica de privacidad debe de estar marcado"
            })
        }
    } catch (error) {
        return res.status(400).json(error)
    }
}

export const authController = {
    createGoogleUser,
    createLocalUser,
    confirmActivationCode,
    login,
    glForgotPassword,
    ForgotPassword,
    changePassword,
    localReferralRegistry
}