import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function auth(request: Request, response: Response, next: NextFunction) {
    const token = request.cookies.token;
    if (!token) {
        console.log("HERE")
        return response.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await prisma.users.findUnique({ where: { id: decoded.id } });

        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return response.status(401).json({ message: "Unauthorized" });
        }
        
        const profilePic = `${request.protocol}://${request.get("host")}/uploads/${user.profilePicture}`;
        request.user = { id: user.id, name: user.name, role: user.role, profilePicture: profilePic };
        next(); 
    } catch (error) {
        response.clearCookie("token");
        return response.status(401).json({ message: "Unauthorized" });
    }
}

export default auth;
