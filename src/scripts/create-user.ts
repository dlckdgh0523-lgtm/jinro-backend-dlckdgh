// 운영 계정 생성/갱신 (admin·teacher·student 공용). 서버에서 1회 실행.
// 사용: node dist/scripts/create-user.js <role> <email> <password> [name] [school] [classroom]
//   role: admin | teacher | student
import bcrypt from 'bcryptjs';
import { PrismaClient, type Role } from '@prisma/client';

async function main(): Promise<void> {
  const [roleArg, email, password, name, school, classroom] = process.argv.slice(2);
  const role = roleArg as Role;
  if (!['admin', 'teacher', 'student'].includes(role) || !email || !password) {
    console.error('usage: node dist/scripts/create-user.js <admin|teacher|student> <email> <password> [name] [school] [classroom]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('password must be at least 8 characters');
    process.exit(1);
  }
  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 10);
  const consents = { tos: true, privacy: true, academic: true, ai: true, age: true } as object;
  const baseName = name || (role === 'admin' ? '운영관리자' : role === 'teacher' ? '선생님' : '학생');
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role,
      passwordHash,
      status: 'active',
      ...(role === 'teacher' ? { school: school || '진로고등학교', classroom: classroom || '1-1' } : {}),
      ...(role === 'student' ? { grade: 'H1' } : {}),
    },
    create: {
      email,
      name: baseName,
      role,
      passwordHash,
      consents,
      ...(role === 'teacher' ? { school: school || '진로고등학교', classroom: classroom || '1-1' } : {}),
      ...(role === 'student' ? { grade: 'H1' } : {}),
    },
  });
  console.log(`${role} ready: ${user.email} (${user.id})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
