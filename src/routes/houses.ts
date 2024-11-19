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

userRouter.post("/createHouse", auth, checkRole, uploadFile, (request, response) => {
    console.log("HERE");
  
    // Obtendo os dados da casa
    const houseInfo = JSON.parse(JSON.stringify(request.body));
    console.log("Informações da casa:", houseInfo);
  
    // Obtendo os nomes dos arquivos enviados
    const mediaFiles = request.uploadedFiles || [];
    console.log("Arquivos de mídia enviados:", mediaFiles);
  
    const newHouse = {
      ...houseInfo,
      mediaFiles,
    };
  
    response.status(200).json({ message: "Imóvel criado com sucesso!", newHouse });
  });


export default userRouter;