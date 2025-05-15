const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const userController = {
  // Register a new user (Public)
  //  Register a new user (Public)
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Login user (Public)
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

      const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "1d" });

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Forget password (Public)
  forgetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: "User not found" });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all users (Admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //  API 5: Get current user's profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ msg: "Error fetching profile", error: error.message });
    }
  },

  //  API 6: Update current user's profile
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;
      const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) return res.status(404).json({ msg: "User not found" });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ msg: "Error updating profile", error: error.message });
    }
  },

  //  API 7: Get user by ID (Admin)
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ msg: "Error fetching user", error: error.message });
    }
  },

  //  API 8: Update user role by ID (Admin)
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      if (!role) return res.status(400).json({ msg: "Role is required" });

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) return res.status(404).json({ msg: "User not found" });
      res.status(200).json({ msg: "User role updated", user });
    } catch (error) {
      res.status(500).json({ msg: "Error updating role", error: error.message });
    }
  },

 
deleteUser: async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ msg: "Error deleting user", error: error.message });
  }
}


};

module.exports = userController;
