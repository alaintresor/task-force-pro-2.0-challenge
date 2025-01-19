import User from "../models/User";

class UserService {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    return user;
  }

  async getUserByUsername(username) {
    const user = await User.findOne({ username });
    return user;
  }
  async getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    return user;
  }
  async forgotPasswordService(email) {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    return resetToken;
  }

  async resetPasswordService(resetToken, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return null;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return user;
  }
}

export default new UserService();
