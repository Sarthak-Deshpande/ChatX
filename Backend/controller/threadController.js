import Thread from '../models/thread.js';
import getOpenRouterAPIResponse from '../utils/openrouter.js';

// GET all threads
export const getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user._id })
            .sort({ updatedAt: -1 })
            .select("threadId title updatedAt createdAt");

        res.status(200).json({
            success: true,
            count: threads.length,
            threads
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch from DB" });
    }
};

// GET specific thread
export const getThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId, userId: req.user._id });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get thread" });
    }
};

// DELETE specific thread
export const deleteThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user._id });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found!" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
};

// POST chat
export const sendMessage = async (req, res) => {
    try {
        const { threadId, message } = req.body;

        if (!threadId || !message) {
            return res.status(400).json({ error: "Missing required fields!" });
        }

        let thread = await Thread.findOne({ threadId, userId: req.user._id });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                userId: req.user._id,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenRouterAPIResponse(thread.messages);

        thread.messages.push({ role: "assistant", content: assistantReply });
        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong!!" });
    }
};