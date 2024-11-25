import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";  
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth";
import uploadFile from "../middleware/uploadFile";
import { UPLOADS_DIR } from "../config/constants";



const prisma = new PrismaClient();
const saltRounds = 10;

const userRouter = express.Router();

// GET Routes

userRouter.get("/auth", auth, (request, response) => {
  response.status(200).send(request.user);
});

userRouter.get("/profile/:userId", auth, async (request, response) => {
  const profileId = request.params.userId;
  const requestedUser = await prisma.users.findUnique({ where: { publicId : profileId } });

  if(!requestedUser) { 
    return response.status(404).send("User not found");
  }

  const profilePicture = `${request.protocol}://${request.get("host")}/uploads/${requestedUser.profilePicture}`;
  const profileBanner = `${request.protocol}://${request.get("host")}/uploads/${requestedUser.profileBanner}`;

  const returnedUser = {
    name: requestedUser.name,
    profilePicture,
    profileBanner,
    role: requestedUser.role,
    profileOwnership: requestedUser.id === request.user.id ? true : false,
    houses: requestedUser.houses
  }

  response.send(returnedUser);
});

// POST Routes

userRouter.post("/signup", async (request: Request, response: Response) => {
  const { name, cpf, phone, birthdate, email, password } = request.body as {
    name: string;
    cpf: string;
    phone: string;
    birthdate: string; 
    email: string;
    password: string;
  };

  if (!name || !cpf || !phone || !birthdate || !email || !password) {
    return response.status(400).send("Preencha todos os campos");
  }


  try {
    const newDate = new Date(birthdate);

    const [firstName, secondName] = name.split(" ");
    let publicId = secondName ? `${firstName}.${secondName}` : firstName;
    
    const generateRandomHash = () => {
      crypto.randomBytes(4).toString("hex");
    }

    while (await prisma.users.findUnique({ where: { publicId } })) {
      publicId = `${publicId}.${generateRandomHash()}`;
    }

    const user = await prisma.users.create({
      data: {
        publicId,
        name,
        cpf,
        phone,
        birthdate: newDate,
        email,
        password: bcrypt.hashSync(password, saltRounds),
      },
    });

    const token = jwt.sign({ id: user.id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET as string);
    response.cookie("token", token, { httpOnly: true});

    return response.status(201).send("User successfully created");
  } catch (error) {
    console.log("Erro ->",error);
    return response.status(500).send("Failed to create user");
  }
});

userRouter.post("/signin", async (request: Request, response: Response) => {
  const { email, password, rememberMe } = request.body;

  if (!email || !password) {
      return response.status(400).send("All fields are required");
  }

  try {
      const user = await prisma.users.findFirst({ where: { email: email.toLowerCase() } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
          return response.status(403).send("Invalid credentials");
      }

      const token = jwt.sign({ id: user.id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET as string);      

      if (rememberMe) {         
        response.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      }else {
        response.cookie("token", token, { httpOnly: true});

      }
    
      return response.status(200).send(user.publicId);
  } catch (error) {
      return response.status(500).send("Error on signin");
  }
});

userRouter.post("/profile",auth, uploadFile, async (request: Request, response: Response) => {
  return response.status(200).send("Profile successfully updated");
})


// UPDATE Routes

userRouter.put("/update", auth, async (request: Request, response: Response) => {
  const { name, cpf, phone, email, password } = request.body as {
      name?: string;
      cpf?: string;
      phone?: string;
      email?: string;
      password?: string; 
  };

  if (!name && !cpf && !phone && !email && !password) {
      return response.status(400).send("Nenhum campo para atualizar foi fornecido.");
  }

  const dataToUpdate: any = {}; 

  if (name) dataToUpdate.name = name;
  if (cpf) dataToUpdate.cpf = cpf;
  if (phone) dataToUpdate.phone = phone;
  if (email) dataToUpdate.email = email;

  let tokenVersionIncremented = false;

  if (password) {
  
      dataToUpdate.password = bcrypt.hashSync(password, saltRounds);
      tokenVersionIncremented = true; 
  }

  try {
      const updatedUser = await prisma.users.update({
          where: { id: request.user.id },
          data: {
              ...dataToUpdate,
              ...(tokenVersionIncremented && { tokenVersion: { increment: 1 } }), 
          },
      });

      return response.status(200).json(updatedUser);
  } catch (error) {
      return response.status(500).send("Erro ao atualizar o usuário");
  }
});




export default userRouter;
