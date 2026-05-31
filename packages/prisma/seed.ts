import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name_userId: { name: 'Food & Drinks', userId: user.id } },
      update: {},
      create: {
        name: 'Food & Drinks',
        color: '#FF6B6B',
        icon: '🍔',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Transport', userId: user.id } },
      update: {},
      create: {
        name: 'Transport',
        color: '#4ECDC4',
        icon: '🚗',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Shopping', userId: user.id } },
      update: {},
      create: {
        name: 'Shopping',
        color: '#45B7D1',
        icon: '🛍️',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Entertainment', userId: user.id } },
      update: {},
      create: {
        name: 'Entertainment',
        color: '#96CEB4',
        icon: '🎬',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Health', userId: user.id } },
      update: {},
      create: {
        name: 'Health',
        color: '#FFEAA7',
        icon: '💊',
        userId: user.id,
      },
    }),
  ]);

  console.log(`Seeded ${categories.length} categories for user ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
