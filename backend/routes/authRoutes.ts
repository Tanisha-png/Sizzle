import express, {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-sizzle-key";

//? Regisiter Route
router.post("/register", async (req: Request, res: Response) => {
    try {
        const {username, email, password} = req.body;

        //? Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //? Create and save new user
        const newUser = new User({
            username,
            email,
            passwordHash: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: "User registered successfully! 😎"});
    } catch (error: any) {
        res.status(500).json({error: "Registration failed. Username or Email already exists."})
    };
});

//? Login Route
router.post("/login", async (req:Request, res: Response) => {
    try {
        const {email, password} = req.body;

        //? Find user by email
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid credentials"});

        //? Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({error: "Invalid credentials"});

        //? Creat JWT Token
        const token = jwt.sign(
            {userId: user._id},
            JWT_SECRET, 
            {expiresIn: "1h"}
        );

        res.json({
            token, 
            username: user.username,
            message: "Sizzling in! 🔥"
        });
    } catch (error) {
        res.status(500).json({error: "Login error"});
    }
});

export default router;