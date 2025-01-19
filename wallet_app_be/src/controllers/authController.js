import bcrypt from "bcrypt";
import SendEmail from "../utils/mailer";
import generateToken from "../utils/generateToken.js";
import UserService from "../services/userService";

class AuthController {
  async login(req, res) {
    try {
      if (!req.body.email || req.body.email === "") {
        return res.status(400).json({
          success: false,
          message: "Please provide email",
        });
      }
      if (!req.body.password || req.body.password === "") {
        return res.status(400).json({
          success: false,
          message: "Please provide password",
        });
      }
      let user = await UserService.getUserByEmail(req.body.email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email address",
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
          ...user._doc,
          password: undefined,
          token: generateToken(user._id),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async register(req, res) {
    if (!req.body.username || req.body.username === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide username",
      });
    }
    if (!req.body.email || req.body.email === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }
    if (!req.body.password || req.body.password === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide password",
      });
    }
    if (!req.body.confirmPassword || req.body.confirmPassword === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide confirmPassword",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords does not match",
      });
    }
    const userExist = await UserService.getUserByEmail(req.body.email);
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await UserService.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      },
    });
  }
  async forgotPassword(req, res) {
    if (!req.body.email || req.body.email === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    const token = await UserService.forgotPasswordService(req.body.email);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    user.resetLink = resetLink;
    const data = { user };
    // send email
    await new SendEmail(data).forgetPassword();
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  }
  async resetPassword(req, res) {
    if (!req.body.password || req.body.password === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide password",
      });
    }
    if (!req.body.confirmPassword || req.body.confirmPassword === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide confirmPassword",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword does not match",
      });
    }
    if (!req.body.token || req.body.token === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide token",
      });
    }
    const user = await UserService.resetPasswordService(
      req.body.token,
      req.body.password
    );
    if (user)
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    else
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
  }
}

export default new AuthController();
