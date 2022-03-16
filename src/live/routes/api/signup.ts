import express from "express";
import userService from "../../../utils/userService.js";

const signup = express.Router();

signup.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.statusCode = 400;
        return res.send("bad request");
    }

    const message = await userService.signup(username, password);
    res.json(message);
});

export default signup;
