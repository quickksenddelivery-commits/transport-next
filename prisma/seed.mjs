import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const firstName = process.env.SEED_ADMIN_FIRST_NAME || 'Admin';
const lastName = process.env.SEED_ADMIN_LAST_NAME || 'User';

if (!email || !password) {
  console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running this script.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, isActive: true, loginAttempts: 0, lockUntil: null },
    create: { email, password: hashed, firstName, lastName, role: 'admin' },
  });

  console.log(`Admin user ready: ${user.email} (id: ${user.id})`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
