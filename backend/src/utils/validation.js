const { z } = require("zod");

exports.registerSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string()
    .min(8)
    .max(16)
    .regex(/[A-Z]/)
    .regex(/[^A-Za-z0-9]/),
});

exports.adminCreateUserSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16),
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});

exports.createStoreSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.string().uuid(),
});

exports.changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string()
    .min(8)
    .max(16)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});