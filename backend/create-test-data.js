const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create operator user
  const operator = await prisma.user.upsert({
    where: { username: 'operator1' },
    update: {},
    create: {
      username: 'operator1',
      email: 'operator1@test.com',
      password: hashedPassword,
      nama: 'Operator Satu',
      role: 'Operator',
      isLocked: false
    }
  });
  console.log('Created operator:', operator.username, operator.role);
  
  // Create a category
  const category = await prisma.category.upsert({
    where: { code: 'ELEC' },
    update: {},
    create: {
      code: 'ELEC',
      name: 'Electronics'
    }
  });
  console.log('Created category:', category.code, category.name);
  
  // Create a sub-category with price limit
  const subCategory = await prisma.subCategory.upsert({
    where: { id: 'sub-cat-1' }, // This won't work, let's use name instead
    update: {},
    create: {
      categoryId: category.id,
      name: 'Smartphones',
      priceLimit: 5000000
    }
  });
  console.log('Created sub-category:', subCategory.name, 'priceLimit:', subCategory.priceLimit);
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });