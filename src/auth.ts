import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth2"

const clientID: string = "688090012606-i35tjpqmeigqj3abl4p6iopucg9f7sho.apps.googleusercontent.com"
const clientSecret: string = "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"


passport.use(new GoogleStrategy({
        clientID,
        clientSecret,
        callbackURL: "http://localhost:3002/auth-all/google/callback",
        // callbackURL: "http://aqua-connections.ca/auto/auth/google/callback",
        passReqToCallback: true
    },
    async (_request: any, _accessToken: any, _refreshToken: any, profile: any, done: any) => {
        done(null, profile)
    }
))



passport.serializeUser((user: any, done: any) => {
    done(null, user)
})

passport.deserializeUser((user: any, done: any) => {
    done(null, user)
})