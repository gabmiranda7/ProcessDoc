import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@processdoc.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@processdoc.com",
      cpf: "00000000000",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Usuário admin criado:", admin);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
