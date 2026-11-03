const { PrismaClient } = require("@prisma/client");
//const prisma = new PrismaClient();
const prisma = require("../utils/prisma");

// Get all stores
exports.getStores = async (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID

  const stores = await prisma.store.findMany({
    include: {
      ratings: true,
    },
  });

  // Map over the results to aggregate data and strip private user information
  const safeStores = stores.map((store) => {
    const totalRatings = store.ratings.length;
    const avgRating =
      totalRatings > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    // Find if the current user has rated this store
    const myRatingObj = store.ratings.find((r) => r.userId === userId);

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalRatings,
      myRating: myRatingObj ? myRatingObj.rating : 0,
    };
  });

  res.json(safeStores);
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