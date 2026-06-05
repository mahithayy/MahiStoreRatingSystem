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
exports.replyToRating = async (req, res) => {
  const { id } = req.params; // ID of the rating
  const { comment } = req.body;
  const ownerId = req.user.id;

  try {
    // Security check: Ensure the owner actually owns the store this rating belongs to
    const rating = await prisma.rating.findUnique({
      where: { id },
      include: { store: true }
    });

    if (!rating || rating.store.ownerId !== ownerId) {
      return res.status(403).json({ error: "Unauthorized to reply to this rating." });
    }

    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { comment },
    });

    res.json(updatedRating);
  } catch (err) {
    res.status(400).json({ error: "Failed to submit reply." });
  }
};