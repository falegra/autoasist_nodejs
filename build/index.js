import "dotenv/config";
import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import "./auth.js";
// Routes
import AuthRoute from "./routes/auth.route.js";
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: "mesecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (_req, res) => {
    return res.status(200).json({
        msg: "Welcome"
    });
});
app.use("/auth", AuthRoute);
app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
});
