import express from 'express'
import ejs from 'ejs'
import session from 'express-session';
import bcrypt from "bcrypt"
import path from "node:path"
import connectDB from './DbConnection/db.js';
import register from './Controllers/userController.js';
import { login } from './Controllers/userController.js';
import { logout } from './Controllers/userController.js';
import { checkLogin } from './middleware/checkLogin.js';

connectDB()
const app = express();
const cssPath = path.resolve("./public")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(cssPath))
app.set("view engine", "ejs")
app.use(session({
    secret: "secrt",
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    res.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
    );
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});
app.get("/", checkLogin, (req, res) => {

    res.render("home", { userName: req.session.user });


})
app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/")
    }
    else {
        res.render("login", { error: null })
    }

})
app.post("/login", login)

app.get("/register", (req, res) => {
    res.render("register", { error: null });
});

app.post("/register", register)

app.post("/logout", logout)

app.listen(3000, () => {
    console.log("Server created")
})