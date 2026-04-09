const { PrismaClient } = require("@prisma/client");
//const prisma = new PrismaClient();
const prisma = require("../utils/prisma");

// Get all stores
exports.getStores = async (req, res) => {
  const stores = await prisma.store.findMany({
    include: {
      ratings: true,
    },
  });

  res.json(stores);
};

// Submit or update rating
exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;
if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  try {
    const existing = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    let result;

    if (existing) {
      result = await prisma.rating.update({
        where: { id: existing.id },
        data: { rating },
      });
    } else {
      result = await prisma.rating.create({
        data: { userId, storeId, rating },
      });
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};