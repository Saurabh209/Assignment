import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import useRouter from './Routes/routes.js'


const PORT = 3000
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(useRouter)
// MongoDB Connection
 
mongoose.connect("mongodb+srv://saurabhhh209:EldenLord@cluster0.amdmprb.mongodb.net/", {
    dbName: "ScriptGuru_Assignment",
})
    .then(() => console.log("Database connected"),
        app.listen(PORT, () => {
            console.log("server is running on port number :", PORT)
        }))
    .catch((err) => console.error("DB connection error:", err));


    

