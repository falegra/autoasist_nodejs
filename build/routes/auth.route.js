import express from "express";
import passport from "passport";
import { authController } from "../controller/auth.controller.js";
import { authValidation } from "../middleware/auth.validateFields.js";
import { validateToken } from "../middleware/validateToken.js";
const router = express.Router();
router.get("/login/google", passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get("/google/callback", passport.authenticate('google', {
    // successRedirect: `/auto/auth/google/success`,
    successRedirect: `/auth/google/success`,
    // failureRedirect: `/auto/auth/google/failure`
    failureRedirect: `/auth/google/failure`
}));
router.get("/google/success", authController.createGoogleUser);
router.get("/google/failure", (_req, res) => {
    return res.status(400).json({
        msg: "Failure"
    });
});
router.post("/register", authValidation.localRegisterValidation, authController.createLocalUser);
router.post("/activation_code", authValidation.localActivationCodeValidation, authController.confirmActivationCode);
router.post("/login", authValidation.localLogin, authController.login);
router.post("/glForgotPassword", authValidation.glForgotPassword, authController.glForgotPassword);
//aqui me debe de mandar un token por Authorization Bearer
router.post("/forgotPassword", validateToken, authValidation.forgotPassword, authController.ForgotPassword);
//aqui me debe de mandar un token por Authorization Bearer
router.post("/changePassword", validateToken, authValidation.changePassword, authController.changePassword);
router.post("/register/referral/local", authValidation.localRegisterValidationReferral, authController.localReferralRegistry);
export default router;
