import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import  authRouter  from "./middleware/auth";
import auth from "./middleware/auth";
import normalizeEmail from "./middleware/normalizeEmail";
import test from "./routes/test";

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


app.use("/user",normalizeEmail,userRouter);
app.use("/test",auth,test);

app.listen(3333, () => {
    console.log("Server running on port 3333")
})