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
    if (err.name === "ZodError") {
      return res.status(400).json({ details: err.errors });
    }
    res.status(400).json({ error: err.message });
  }
};
// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, address, role },
    });
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ details: err.errors });
    }
    res.status(400).json({ error: "Failed to update user. Email might already exist." });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User and all related data deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete user." });
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
    if (err.name === "ZodError") {
      return res.status(400).json({ details: err.errors });
    }
    res.status(400).json({ error: err.message });
  }
};
// Update Store
exports.updateStore = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, ownerId } = req.body;
  try {
    const updatedStore = await prisma.store.update({
      where: { id },
      data: { name, email, address, ownerId },
    });
    res.json(updatedStore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Store
exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.store.delete({ where: { id } });
    res.json({ message: "Store and all its ratings deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete store." });
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
    include: {
      store: {
        include: { ratings: true }
      }
    }
  });

  // Strip passwords before sending to the admin frontend
  const cleanUsers = users.map(user => {
    const { password,store, ...userWithoutPassword } = user;
    let avgStoreRating = null;
    if (store && store.ratings.length > 0) {
      const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
      avgStoreRating = (sum / store.ratings.length).toFixed(1);
    }

    return {
      ...userWithoutPassword,
      avgStoreRating // Send this new field to the frontend
    };
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