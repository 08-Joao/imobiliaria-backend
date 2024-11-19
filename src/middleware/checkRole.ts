import express, { Request, Response, NextFunction } from "express";

async function checkRole(request: Request, response: Response, next: NextFunction) {
    request.user.role === "ADMIN" || request.user.role === "AGENT" ? next() : response.status(403).send("Forbidden. You don't have permission to access this resource.");
}

export default checkRole;