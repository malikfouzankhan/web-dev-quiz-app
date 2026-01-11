import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const userData = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

const userModel = mongoose.model("users", userData);

export default userModel;