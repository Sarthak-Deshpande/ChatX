import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
export const register = async (req, res) => {
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ error: "All fields are required!"});
        }

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({ error: "Email already registered!" });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};

// login
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ error: "All fields are required!"});
        }

        const user = await User.findOne({ email });
        
        if(!user){
            return res.status(401).json({error: "Invalid email or password"});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch(err){
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

// Get current user
export const getMe = async (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    });
};