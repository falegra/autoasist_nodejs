var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { googleModel } from "../models/google.model.js";
import { localModel } from "../models/local.model.js";
import { generate_activation_code } from "../helpers/generate_activation_code.js";
import { encryptManager } from "../helpers/hash_password.js";
import { tokenManager } from "../helpers/tokenManager.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { save_referrals_id } from "../helpers/save_referrals_id.js";
import { referralsModel } from "../models/referrals.model.js";
const createGoogleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const email: string = req.user._json.email
        // const name: string = req.user._json.name
        const { email, name } = req.user._json;
        const referral_code = new Date().getTime();
        if (!(yield googleModel.existEmail(email))) {
            const user = {
                name,
                email,
                created_at: "",
                updated_at: "",
                deleted_at: "",
                accept: true,
                authorization: true,
                referral_code,
                number_of_referrals: 0
            };
            if (yield googleModel.saveUser(user)) {
                //envio un email de confirmacion
                const data = {
                    to: email,
                    subject: "Bienvenido",
                    text: "Bienvenido a nuestra plataforma"
                };
                yield sendEmail.send(data);
            }
        }
        const token = tokenManager.generateToken(email);
        return res.status(200).json({
            email,
            token
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const createLocalUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const email: string = req.body.email
        // const hash_password: string = req.body.password
        // const accept_req: string = req.body.accept
        // const authorization_req: strin
        const { email, hash_password, accept_req, authorization_req } = req.body;
        const referral_code = new Date().getTime();
        const activation_code = generate_activation_code();
        const name = req.body.name || "";
        const created_at = req.body.created_at || "";
        const updated_at = req.body.updated_at || "";
        const deleted_at = req.body.deleted_at || "";
        if (accept_req === "on" && authorization_req === "on") {
            const accept = true;
            const authorization = true;
            const activate = true;
            const number_of_referrals = 0;
            if ((yield googleModel.existEmail(email)) || (yield localModel.existEmail(email))) {
                return res.status(406).json({
                    msg: "El email ya está en uso"
                });
            }
            const password = yield encryptManager.encryptPassword(hash_password);
            let user = {
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
            };
            if (yield localModel.saveUser(user)) {
                //envio un email de confirmacion
                const data = {
                    to: email,
                    subject: "Bienvenido",
                    text: `Su código de activación es ${activation_code}`
                };
                yield sendEmail.send(data);
            }
            return res.status(200).json({
                email
            });
        }
        else {
            return res.status(400).json({
                msg: "El campo pólitica de privacidad debe de estar marcado"
            });
        }
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const confirmActivationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activation_code = req.body.activation_code;
        const [valid, email] = yield localModel.confirmActivationCode(activation_code);
        if (valid === 0) {
            return res.status(404).json({
                msg: "Código no válido"
            });
        }
        else if (valid === 1) {
            return res.status(200).json({
                msg: "La cuenta estaba activada"
            });
        }
        else {
            //genero el token
            const token = tokenManager.generateToken(email);
            return res.status(200).json({
                msg: "Se activo la cuento correctamente",
                token
            });
        }
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const email: string = req.body.email
        // const password: string = req.body.password
        const { email, password } = req.body;
        if (!(yield localModel.existEmail(email))) {
            return res.status(404).json({
                msg: "Este email no está registrado"
            });
        }
        const activate = yield localModel.verifyActivateAccount(email);
        if (activate !== 1) {
            return res.status(403).json({
                msg: "Debe de activar la cuenta"
            });
        }
        let db_password = yield localModel.getUser("password", "email", email);
        db_password = db_password.password;
        const valid = yield encryptManager.comparePassword(password, db_password);
        if (!valid) {
            return res.status(400).json({
                msg: "El password no es correcto"
            });
        }
        const token = tokenManager.generateToken(email);
        return res.status(200).json({
            msg: "Password correcto",
            token
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const glForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const token = tokenManager.generateToken(email);
        const link = `http://url.com/del/front-end/${token}`;
        //envio un email para enviar el link de cambio de clave
        const data = {
            to: email,
            subject: "Cambio de clave",
            text: `Éste es su link para el cambio de clave ${link}`
        };
        yield sendEmail.send(data);
        return res.status(200).json({
            ok: true,
            link
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const ForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const email: string = req.key
        // const new_password: string = req.body.new_password
        // const re_new_password: string = req.body.re_new_password
        const { email, new_password, re_new_password } = req.body;
        if (new_password !== re_new_password) {
            return res.status(400).json({
                msg: "No coinciden las contraseñas"
            });
        }
        const password = yield encryptManager.encryptPassword(new_password);
        yield localModel.updatePassword(email, password);
        return res.status(200).json({
            msg: "Se cambió la contraseña correctamente"
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const email: string = req.key
        // const new_password: string = req.body.new_password
        const { email, new_password } = req.body;
        if (!(yield localModel.existEmail(email))) {
            msg: "Éste email no está registrado";
        }
        const password = yield encryptManager.encryptPassword(new_password);
        yield localModel.updatePassword(email, password);
        return res.status(200).json({
            msg: "Cambió la contraseña correctamente"
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
const localReferralRegistry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const email: string = req.body.email
        // const password: string = req.body.password
        // const accept: string = req.body.accept
        // const authorization: string = req.body.authorization
        const { email, password, accept, authorization } = req.body;
        const user_referral_code = Number(req.body.referral_code);
        const referral_code = new Date().getTime();
        const activation_code = generate_activation_code();
        const name = req.body.name || "";
        const created_at = req.body.created_at || "";
        const updated_at = req.body.updated_at || "";
        const deleted_at = req.body.deleted_at || "";
        if (!(yield localModel.verifyReferralCode(user_referral_code)) && !(yield googleModel.verifyReferralCode(user_referral_code))) {
            return res.status(404).json({
                msg: "Código de referido incorrecto"
            });
        }
        if (accept === "on" && authorization === "on") {
            if ((yield localModel.existEmail(email)) || (yield googleModel.existEmail(email))) {
                return res.status(406).json({
                    msg: "El email ya está en uso"
                });
            }
            let user = {
                name,
                email,
                password: yield encryptManager.encryptPassword(password),
                created_at,
                updated_at,
                deleted_at,
                accept: true,
                authorization: true,
                referral_code,
                activation_code,
                activate: false,
                number_of_referrals: 0
            };
            if (yield localModel.saveUser(user)) {
                if (yield localModel.verifyReferralCode(user_referral_code)) {
                    yield localModel.incrementReferral(user_referral_code);
                }
                else {
                    yield googleModel.incrementReferral(user_referral_code);
                }
                const data = {
                    to: email,
                    subject: "Bienvendio",
                    text: `Su código de activación es ${activation_code}`
                };
                yield sendEmail.send(data);
                const ids = yield save_referrals_id(user_referral_code, referral_code);
                yield referralsModel.saveIds(ids);
            }
            return res.status(200).json({
                email
            });
        }
        else {
            return res.status(400).json({
                msg: "El campo politica de privacidad debe de estar marcado"
            });
        }
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
export const authController = {
    createGoogleUser,
    createLocalUser,
    confirmActivationCode,
    login,
    glForgotPassword,
    ForgotPassword,
    changePassword,
    localReferralRegistry
};
