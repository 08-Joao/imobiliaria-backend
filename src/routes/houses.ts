import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRouter = express.Router();

userRouter.get("/:houseId", (request, response) => { 
    const house = prisma.houses.findUnique({ where: { id: request.params.houseId } });

    if (!house) {
        return response.status(404).send("House not found");
    }

    
})