import { type Desk, type PrismaClient } from "@prisma/client";
import * as service from "../service/desk.service";
export const getDesk: GetDesk = service.getDeskService;

export const getDesks: GetDesks = service.getDesksService;

interface GetDesk {
  (prisma: PrismaClient, table_id: number): Promise<Desk | null>;
}

interface GetDesks {
	(prisma: PrismaClient, corporation_id: string): Promise<Desk[]>;
}

