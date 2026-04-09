const { PrismaClient } = require("@prisma/client");
//const prisma = new PrismaClient();
const prisma = require("../utils/prisma");

// Get store ratings
exports.getStoreRatings = async (req, res) => {
  const ownerId = req.user.id;

  const store = await prisma.store.findUnique({
    where: { ownerId },
    include: {
      ratings: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  const avgRating =
    store.ratings.reduce((acc, r) => acc + r.rating, 0) /
    (store.ratings.length || 1);

  res.json({
    storeName: store.name,
    avgRating,
    ratings: store.ratings,
  });
};