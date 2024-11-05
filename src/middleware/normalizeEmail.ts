import express, { Request, Response, NextFunction } from "express";

function normalizeEmail(request: Request, response: Response, next: NextFunction) { 
    if(request.body && request.body.email) {
        request.body.email = request.body.email.toLowerCase()
    }
    next()
}

export default normalizeEmail