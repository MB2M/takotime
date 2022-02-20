import express from "express";
import userService from "../../utils/userService.js";

const login = express.Router()

login.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.statusCode = 400;
        res.send("bad request");
    } else {
        const message = await userService.login(username, password);
        res.json(message);
    }

});


export default login;
