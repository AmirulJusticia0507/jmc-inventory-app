const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { code: 'SPARE', name: 'Spare Parts' },
  { code: 'OIL', name: 'Oli & Pelumas' },
  { code: 'TIRE', name: 'Ban & Velg' },
  { code: 'BATT', name: 'Aki & Elektrikal' },
  { code: 'CARE', name: 'Perawatan & Detailing' },
  { code: 'ACC', name: 'Aksesoris' },
  { code: 'TOOL', name: 'Alat & Equipment' },
  { code: 'BODY', name: 'Body & Cat' },
];

const subCategories = [
  // SPARE
  { categoryCode: 'SPARE', name: 'Filter Oli', priceLimit: 500000 },
  { categoryCode: 'SPARE', name: 'Filter Udara', priceLimit: 300000 },
  { categoryCode: 'SPARE', name: 'Busi', priceLimit: 200000 },
  { categoryCode: 'SPARE', name: 'Kampas Rem', priceLimit: 800000 },
  { categoryCode: 'SPARE', name: 'Karet Wiper', priceLimit: 150000 },
  { categoryCode: 'SPARE', name: 'Oli Mesin Sintetis', priceLimit: 1500000 },
  { categoryCode: 'SPARE', name: 'Oli Mesin Semi', priceLimit: 800000 },
  { categoryCode: 'SPARE', name: 'Oli Transmisi', priceLimit: 600000 },
  { categoryCode: 'SPARE', name: 'Pelumas Rantai', priceLimit: 200000 },

  // OIL
  { categoryCode: 'OIL', name: 'Oli Mesin Sintetis', priceLimit: 1500000 },
  { categoryCode: 'OIL', name: 'Oli Mesin Semi', priceLimit: 800000 },
  { categoryCode: 'OIL', name: 'Oli Transmisi', priceLimit: 600000 },
  { categoryCode: 'OIL', name: 'Oli Gardan', priceLimit: 500000 },
  { categoryCode: 'OIL', name: 'Pelumas Rem', priceLimit: 300000 },
  { categoryCode: 'OIL', name: 'Coolant', priceLimit: 250000 },

  // TIRE
  { categoryCode: 'TIRE', name: 'Ban Tubeless', priceLimit: 2500000 },
  { categoryCode: 'TIRE', name: 'Ban Dalam', priceLimit: 300000 },
  { categoryCode: 'TIRE', name: 'Velg Alloy', priceLimit: 5000000 },
  { categoryCode: 'TIRE', name: 'Velg Steel', priceLimit: 1500000 },
  { categoryCode: 'TIRE', name: 'Ban Motor', priceLimit: 800000 },

  // BATT
  { categoryCode: 'BATT', name: 'Aki Kering', priceLimit: 1200000 },
  { categoryCode: 'BATT', name: 'Aki Cair', priceLimit: 800000 },
  { categoryCode: 'BATT', name: 'Kabel Jumper', priceLimit: 300000 },
  { categoryCode: 'BATT', name: 'Charger Aki', priceLimit: 500000 },

  // CARE
  { categoryCode: 'CARE', name: 'Shampoo Mobil', priceLimit: 200000 },
  { categoryCode: 'CARE', name: 'Wax & Polish', priceLimit: 400000 },
  { categoryCode: 'CARE', name: 'Pembersih Mesin', priceLimit: 300000 },
  { categoryCode: 'CARE', name: 'Pewangi Mobil', priceLimit: 100000 },
  { categoryCode: 'CARE', name: 'Kilap Ban', priceLimit: 150000 },

  // ACC
  { categoryCode: 'ACC', name: 'Taplak & Karpet', priceLimit: 1000000 },
  { categoryCode: 'ACC', name: 'Audio & Multimedia', priceLimit: 3000000 },
  { categoryCode: 'ACC', name: 'Kamera Belakang', priceLimit: 1500000 },
  { categoryCode: 'ACC', name: 'Sensor Parkir', priceLimit: 800000 },
  { categoryCode: 'ACC', name: 'GPS Navigasi', priceLimit: 2000000 },

  // TOOL
  { categoryCode: 'TOOL', name: 'Jack & Kunci Roda', priceLimit: 500000 },
  { categoryCode: 'TOOL', name: 'Scanner OBD2', priceLimit: 2000000 },
  { categoryCode: 'TOOL', name: 'Kompresor Angin', priceLimit: 1000000 },
  { categoryCode: 'TOOL', name: 'Kunci Sok', priceLimit: 800000 },
  { categoryCode: 'TOOL', name: 'Tester Aki', priceLimit: 500000 },

  // BODY
  { categoryCode: 'BODY', name: 'Cat Spray', priceLimit: 300000 },
  { categoryCode: 'BODY', name: 'Cat Cat', priceLimit: 500000 },
  { categoryCode: 'BODY', name: 'Kaca Film', priceLimit: 1000000 },
  { categoryCode: 'BODY', name: 'Stiker Mobil', priceLimit: 500000 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { code: cat.code } });
    if (existing) {
      console.log(`⏭️  Category ${cat.code} already exists`);
    } else {
      await prisma.category.create({ data: cat });
      console.log(`✅ Created category: ${cat.code} - ${cat.name}`);
    }
  }

  // Create sub-categories
  for (const sub of subCategories) {
    const category = await prisma.category.findUnique({ where: { code: sub.categoryCode } });
    if (!category) {
      console.log(`⚠️  Category ${sub.categoryCode} not found for sub: ${sub.name}`);
      continue;
    }

    const existing = await prisma.subCategory.findFirst({
      where: { categoryId: category.id, name: sub.name },
    });
    if (existing) {
      console.log(`⏭️  Sub-category ${sub.name} already exists`);
    } else {
      await prisma.subCategory.create({
        data: {
          categoryId: category.id,
          name: sub.name,
          priceLimit: sub.priceLimit,
        },
      });
      console.log(`✅ Created sub-category: ${sub.name} (Rp ${sub.priceLimit.toLocaleString('id-ID')})`);
    }
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });