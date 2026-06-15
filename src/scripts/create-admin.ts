// 운영 최초 관리자 생성/승격. (admin 가입 엔드포인트가 없으므로 서버에서 1회 실행)
// 사용:  docker compose -f docker-compose.prod.yml exec api node dist/scripts/create-admin.js <email> <password> [name]
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const [email, password, name] = process.argv.slice(2);
  if (!email || !password) {
    console.error('usage: node dist/scripts/create-admin.js <email> <password> [name]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('password must be at least 8 characters');
    process.exit(1);
  }
  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'admin', passwordHash, status: 'active' },
    create: { email, name: name || '관리자', role: 'admin', passwordHash, consents: { tos: true, privacy: true, academic: true, ai: true, age: true } },
  });
  console.log(`admin ready: ${user.email} (${user.id})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
