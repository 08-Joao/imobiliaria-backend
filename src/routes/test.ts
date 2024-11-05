import express, { Request, Response, NextFunction } from "express";


const userRouter = express.Router();

userRouter.get("/", (request, response) => {
    response.send("Response from /test");
});


export default userRouter