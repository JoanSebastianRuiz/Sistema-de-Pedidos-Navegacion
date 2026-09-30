import { seedAdmin } from './runners/admin.seed';
import { seedCategories } from './runners/categories.seed';
import { seedProducts } from './runners/products.seed';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    await seedAdmin();
    await seedCategories();
    await seedProducts();

    console.log('✅ Seed completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed');
    console.error(error);

    process.exit(1);
  }
}

seed();
