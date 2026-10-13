const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
      nama: 'Administrator',
      role: 'Admin',
      isLocked: false
    }
  });
  console.log('Created user:', user.username, user.role);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });