import { error } from "node:console"
import userModel from "../model/userModel.js"
import bcrypt from 'bcrypt'


const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    try {


        if (password !== confirmPassword) {
            return res.render("register",{error:"Password not matched"})
        }

        const hashedPassword = await bcyrpt.hash(password, 10);
        await userModel.create({
            name,
            email,
            password: hashedPassword
        })
        res.redirect("/login")

    } catch (error) {

        console.log(error.message)
    }



}
export default register;

export const login = async (req, res) => {

    const { email, password } = req.body;
    try {

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.render("login", { error: "User Not found" })
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.render("login", { error: "Password does not match" });
        }

        req.session.user=email;

        res.redirect("/")

    }
    catch (error) {
        res.send(console.log(error))
    }

}

export const logout = (req,res)=>{

    req.session.destroy(()=>{
        res.redirect("/login")
    })

}