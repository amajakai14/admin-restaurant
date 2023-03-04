import { type Desk, type PrismaClient } from "@prisma/client";
import { getDeskService } from "../service/desk.service";
export const getDesk: GetDesk = getDeskService;
interface GetDesk {
  (prisma: PrismaClient, table_id: number): Promise<Desk | null>;
}
