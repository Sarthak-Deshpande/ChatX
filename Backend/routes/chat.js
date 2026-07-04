import express from 'express';
import protect from '../middleware/auth.js';
import {
    getAllThreads,
    getThread,
    deleteThread,
    sendMessage
} from '../controller/threadController.js';

const router = express.Router();

router.get("/thread", protect, getAllThreads);
router.get("/thread/:threadId", protect, getThread);
router.delete("/thread/:threadId", protect, deleteThread);
router.post("/chat", protect, sendMessage);

export default router;