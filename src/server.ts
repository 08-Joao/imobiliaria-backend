import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import  authRouter  from "./middleware/auth";
import auth from "./middleware/auth";
import normalizeEmail from "./middleware/normalizeEmail";
import test from "./routes/test";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { UPLOADS_DIR } from "./config/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true); 
        }
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/user",normalizeEmail,userRouter);
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/test",auth,test);

app.listen(3333, () => {
    console.log("Server running on port 3333")
})