
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

export async function register(req, res) {
  const { name, email, password } = req.validatedBody;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "Email is already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  res.status(201).json({
    user: publicUser(user),
    token: createToken(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.validatedBody;

  const user = await User.findOne({ email: email.toLowerCase() })
    .select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({ user: publicUser(user), token: createToken(user) });
}

export async function getMe(req, res) {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "User not found");

  res.json({ user: publicUser(user) });
}
