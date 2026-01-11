import mongoose from "mongoose";

const questionDataSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        trim: true
    },
    set: {
        type: [
            {
                question: {
                    type: String
                },
                options: {
                    type: Array,
                },
                correct: {
                    type: Number
                }
            }
        ]
    }
}, {
    timestamps: true
});

const questionDataModel = mongoose.model("question-bank", questionDataSchema);

export default questionDataModel;