const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { registerSchema , changePasswordSchema} = require("../utils/validation");

//const prisma = new PrismaClient();
const prisma = require("../utils/prisma");
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});
exports.register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: "USER",
      },
    });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ details: err.errors });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(user);

  // Attach token to the cookie
  res.cookie("token", token, getCookieOptions());


  res.json({ id: user.id, role: user.role });
};
exports.logout = async (req, res) => {
  res.cookie("token", "", {
    ...getCookieOptions(),
    maxAge: 0 // Expire immediately
  });
  res.json({ message: "Logged out successfully" });
};
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
  const userId = req.user.id; // Comes from verifyToken middleware

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Verify old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid old password" });

  // Hash new password and save
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  res.json({ message: "Password updated successfully" });
};