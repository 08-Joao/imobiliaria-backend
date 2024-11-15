import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRouter = express.Router();

// GET ROUTES

userRouter.get("/:houseId", (request, response) => { 
    const house = prisma.houses.findUnique({ where: { id: request.params.houseId } });

    if (!house) {
        return response.status(404).send("House not found");
    }

    
})


// POST ROUTES

userRouter.post("/createHouse", (request, response) => { 
    console.log("HERE")
    const houseInfo = request.body;
    console.log(houseInfo)

    response.status(200).send("dshfsidu");

})


export default userRouter;