import { PrismaClient } from "@prisma/client";

export async function getDeskService(prisma: PrismaClient, table_id: number) {
  return await prisma.desk.findUnique({ where: { id: table_id } });
}

export async function getDesksService(prisma: PrismaClient, corporation_id: string) {
	return await prisma.desk.findMany({ where: { corporation_id }, orderBy: { id: "asc" } });
}

export async function getDeskHistoryService(prisma: PrismaClient, table_id: number, time_start: Date) {
	return await prisma.desk.findMany({ where: { table_id, time_start } });
}

