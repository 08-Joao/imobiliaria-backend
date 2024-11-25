import express, { Request, Response, NextFunction } from "express";
import uploadFile from "../middleware/uploadFile";
const userRouter = express.Router();

userRouter.post("/file", uploadFile, (request, response) => {
    response.status(200).send(request.uploadedFile);
});

export default userRouter