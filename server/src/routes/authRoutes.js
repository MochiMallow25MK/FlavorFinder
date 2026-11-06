import { Router } from "express";
import User from "../models/User.js";
import createToken from "../utils/createToken.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const user = await User.create({ name: name.trim(), email, password });
    res.status(201).json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    res.json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

export default router;
