import { validationResult, body } from "express-validator";

const validationResultExpress = (req: any, res: any, next: any) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()
        })
    }

    next()
}

const localRegisterValidation = [
    body("email", "Incorrect email format").trim().isEmail().normalizeEmail(),
    body("password", "Empty password field").notEmpty(),
    body("password", "Min characters require").isLength({min:6}),
    body("accept", "Empty accept field").trim().notEmpty(),
    body("authorization", "Empty authorization field").trim().notEmpty(),

    validationResultExpress
]

const localActivationCodeValidation = [
    body("activation_code", "Empty activation_code field").trim().notEmpty().isLength({min:6}),

    validationResultExpress
]

const localLogin = [
    body("email", "Incorrect email format").trim().isEmail().normalizeEmail(),
    body("password", "Empty password field").notEmpty(),
    body("password", "Min character require").isLength({min:6}),

    validationResultExpress
]

const glForgotPassword = [
    body("email", "Incorrect email format").trim().isEmail().normalizeEmail(),

    validationResultExpress
]

const forgotPassword = [
    body("new_password", "Empty field or min character require").notEmpty().isLength({min:6}),
    body("re_new_password", "Empty field or min character require").notEmpty().isLength({min:6}),

    validationResultExpress
]

const changePassword = [
    body("new_password", "Empty field or min character require").notEmpty(),

    validationResultExpress
]

const localRegisterValidationReferral = [
    body("email", "Incorrect email format").trim().isEmail().normalizeEmail(),
    body("password", "Empty password field").notEmpty(),
    body("password", "Min characters require").isLength({min:6}),
    body("accept", "Empty accept field").trim().notEmpty(),
    body("authorization", "Empty authorization field").trim().notEmpty(),
    body("referral_code", "Empty field or min character require").notEmpty(),


    validationResultExpress
]

export const authValidation = {
    localRegisterValidation,
    localActivationCodeValidation,
    localLogin,
    glForgotPassword,
    forgotPassword,
    changePassword,
    localRegisterValidationReferral
}