import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import uploadFile from "../middleware/uploadFile";
import auth from "../middleware/auth";
import checkRole from "../middleware/checkRole";

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

userRouter.post("/createHouse", auth, checkRole, (request, response) => {
  
    // Obtendo os dados da casa
    const houseInfo = request.body
    console.log("Informações da casa:", houseInfo);

  
  
    response.status(200).send("Casa criada com sucesso!");
  });


export default userRouter;