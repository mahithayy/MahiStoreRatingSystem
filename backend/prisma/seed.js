const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Check if an admin already exists to prevent duplicates
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('SuperSecret1!', 10);

    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@mahitha.com',
        password: hashedPassword,
        address: 'Admin Headquarters, Pune',
        role: 'ADMIN',
      },
    });
    console.log('✅ Default Admin created successfully.');
  } else {
    console.log('⚡ Admin already exists. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });