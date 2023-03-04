import { PrismaClient } from "@prisma/client";

export async function getDeskService(prisma: PrismaClient, table_id: number) {
  return await prisma.desk.findUnique({ where: { id: table_id } });
}
