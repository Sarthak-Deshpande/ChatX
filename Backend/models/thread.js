import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const threadSchema = mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: "New Chat",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: false,
    },
    messages: [messageSchema],
}, { timestamps: true }); 

export default mongoose.model("Thread", threadSchema);