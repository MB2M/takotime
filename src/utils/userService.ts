import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
    async signup(username: string, password: string) {
        const result = await User.findOne({ username: username }).catch(
            (err) => {
                console.error(err);
            }
        );

        // username doesn't exist
        if (!result) {
            const hash = await bcrypt.hash(password, 10);
            const user = new User({
                username: username,
                password: hash,
            });
            user.save();
            const token = this.getToken(username);
            return {
                success: true,
                message: token,
            };
        } else {
            return {
                success: false,
                message: "Username already exist",
            };
        }
    },
    getToken(username: string) {
        const secret = process.env.TOKEN_SECRET;
        if (typeof secret === "string") {
            const token = jwt.sign({ username: username }, secret);
            return token;
        }
    },

    async login(username: string, password: string) {
        const user: any = await User.findOne({ username: username }).catch(
            (err) => {
                console.error(err);
            }
        );
        if (!user) {
            return {
                success: false,
                message: "Wrong username / password",
            };
        } else {
            if (user.authenticate(password)) {
                const token = this.getToken(username);
                return {
                    success: true,
                    message: token,
                };
            } else {
                return {
                    success: true,
                    message: "Wrong username / password",
                };
            }
        }
    },
};
