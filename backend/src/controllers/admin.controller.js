const { PrismaClient } = require("@prisma/client");
//const prisma = new PrismaClient();
const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const { adminCreateUserSchema, createStoreSchema } = require("../utils/validation");
// Add user (ADMIN creates USER or ADMIN or STORE_OWNER)
exports.createUser = async (req, res) => {
  //const { name, email, password, address, role } = req.body;

  try {
    const data = adminCreateUserSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashedPassword, address: data.address, role: data.role },
    });



    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create store
exports.createStore = async (req, res) => {
  //const { name, email, address, ownerId } = req.body;

  try {
    const data = createStoreSchema.parse(req.body);
    const store = await prisma.store.create({
      data: { name: data.name, email: data.email, address: data.address, ownerId: data.ownerId },
    });

    res.json(store);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Dashboard stats
exports.getDashboard = async (req, res) => {
  const users = await prisma.user.count();
  const stores = await prisma.store.count();
  const ratings = await prisma.rating.count();

  res.json({ users, stores, ratings });
};

exports.getUsers = async (req, res) => {
  // Extract query parameters (e.g., ?sortBy=email&order=asc&role=USER)
  const { search, role, sortBy = "name", order = "asc" } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { [sortBy]: order },
  });

  // Strip passwords before sending to the admin frontend
  const cleanUsers = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json(cleanUsers);
};

// Get all stores (List, search, sort)
exports.getStores = async (req, res) => {
  const { search, sortBy = "name", order = "asc" } = req.query;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const stores = await prisma.store.findMany({
    where,
    orderBy: { [sortBy]: order },
    include: {
      owner: { select: { name: true, email: true } }, // Helpful for the admin table
      ratings: true
    }
  });

  res.json(stores);
};