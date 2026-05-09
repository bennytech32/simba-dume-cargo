const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const matawi = [
    "Mkata", "Handeni", "Mabalanga", "Kwinji", "Kwediboma",
    "Kibirashi", "Mafisa", "Songe", "Lengatei", "Kijungu",
    "Pori namba 01", "Kibaya kiteto", "Njoro", "Mrijo",
    "Mkoka", "Dosidosi", "Ngusero", "Matui", "Gairo", "Dumila"
  ];

  console.log('Inaanza kuingiza matawi yote...');

  for (const jina of matawi) {
    await prisma.branch.create({
      data: {
        name: jina,
        address: "Tanzania" // ✅ TUMEREKEBISHA HAPA (Kutoka 'location' kwenda 'address')
      }
    });
  }

  console.log('Hongera! Matawi yote 20 yameingizwa kikamilifu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });