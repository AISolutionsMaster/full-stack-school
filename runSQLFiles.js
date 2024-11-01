const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runSQLFile(filePath) {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }

    console.log(`Executed ${filePath} successfully`);
  } catch (error) {
    console.error(`Error executing ${filePath}:`, error);
  }
}

async function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.error('Please provide at least one SQL file as an argument');
    process.exit(1);
  }

  for (const file of files) {
    await runSQLFile(file);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  prisma.$disconnect();
});
