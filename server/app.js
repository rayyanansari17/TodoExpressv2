import express from "express";
import dotenv from "dotenv";
dotenv.config();
import publicRouter from "./controllers/public/public.js";
import privateRouter from "./controllers/private/private.js";
import middleware from "/middleware/auth.js";

const port = process.env.PORT

const app = express();

app.get("/", (req, res)=>{
    try {
        res.status(200).json({msg:"Server is running fine!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
});

app.use(express.json());
app.use("/public", publicRouter);
app.use(middleware);
app.use("/user", privateRouter);

app.listen(port, ()=>{
    console.log(`Server is up and running on: http://localhost:${port}`);
});