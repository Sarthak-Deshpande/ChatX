import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({error:"Not Authorized, no token"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch(err){
        return res.status(401).json({error: "Not authorized, invalid token"});
    }
};

export default protect;