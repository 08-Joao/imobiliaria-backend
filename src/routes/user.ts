import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth";
import normalizeEmail from "../middleware/normalizeEmail";

const prisma = new PrismaClient();
const saltRounds = 10;

const userRouter = express.Router();


userRouter.get("/auth", auth, (request, response) => {
  response.send("From the get");
});

userRouter.post("/signin", async (request: Request, response: Response) => {
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

    const user = await prisma.users.create({
      data: {
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
    console.log(error);
    return response.status(500).send("Failed to create user");
  }
});

userRouter.post("/login", async (request: Request, response: Response) => {
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

      return response.status(200).send("Login successful");
  } catch (error) {
      return response.status(500).send("Error on login");
  }
});

userRouter.put("/update", auth, normalizeEmail, async (request: Request, response: Response) => {
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
