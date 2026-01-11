import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./utils/dbConnect.js";
import cors from "cors";
import questionDataModel from "./models/Data.js";
import bcrypt from "bcrypt";
import userModel from "./models/User.js";
import jwt from "jsonwebtoken";
import generateToken from "./utils/token.js";


const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.post("/api/get-set", async(req, res)=> {
    try {
        const {category, difficulty} = req.body;
        // console.log(category, difficulty);
        let questions = await questionDataModel.findOne({category, difficulty});
        // console.log(questions);
        res.status(200).json(questions.set);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

app.post("/api/enter-set", async (req, res)=> {
    try {
        const {category, difficulty, set} = req.body;
        let data = {
            category,
            difficulty,
            set
        };
        await questionDataModel.create(data);
        res.status(201).json({msg: "set entered successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

app.post("/api/register-user", async (req, res)=> {
    try {
        let {name, email, password} = req.body;
        password = await bcrypt.hash(password, 10);
        let userData = {
            name,
            email,
            password
        };
        let ifExist = await userModel.findOne({email});
        if(ifExist)
        {
            return res.status(400).json({msg: "User already exists! Please log in"});
        }
        await userModel.create(userData);
        res.status(201).json({msg: "User registered successfully! Please login."});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

app.post("/api/login-user", async (req, res)=> {
    try {
        const {email, password} = req.body;
        let ifExist = await userModel.findOne({email});
        if(!ifExist)
        {
            return res.status(400).json({msg: "User not registered. Please register before logging in"});
        }
        console.log(ifExist);
        let passCheck = await bcrypt.compare(password, ifExist.password);
        if(!passCheck)
        {
            return res.status(400).json({msg: "Incorrect credentials. Try again"});
        }
        let payload = {
            id: ifExist._id,
            name: ifExist.name,
            email
        }
        let token = await generateToken(payload);
        res.status(200).json({token,msg: "Logged in successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

app.listen(port, ()=>{
    console.log(`Server is up and running at: http://localhost:${port}`);
});