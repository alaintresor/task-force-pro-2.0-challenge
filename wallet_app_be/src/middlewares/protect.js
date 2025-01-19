import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

export const isAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Not authorized, Admin only authorized" });
    }
    next();
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
