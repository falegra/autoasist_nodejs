var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
const clientID = "688090012606-i35tjpqmeigqj3abl4p6iopucg9f7sho.apps.googleusercontent.com";
const clientSecret = "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";
passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: "http://localhost:3002/auth/google/callback",
    // callbackURL: "http://aqua-connections.ca/auto/auth/google/callback",
    passReqToCallback: true
}, (_request, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    done(null, profile);
})));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
