import { type PresignedPost } from "@aws-sdk/s3-presigned-post";
import { type Menu, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { type createMenuSchema, type uploadImageSchema } from "../routers/menu";
import {
  addMenuImageURLService,
  addMenuService,
  getMenuService as getMenusService,
  setMenuHasImageService,
  uploadMenuImageService,
} from "../service/menu.service";

export const addMenu: AddMenu = addMenuService;

export const uploadMenuImage: UploadMenuImage = uploadMenuImageService;

export const setMenuHasImage: SetMenuHasImage = setMenuHasImageService;

export const addImageUrl: AddImageUrl = addMenuImageURLService;

export const getMenus: GetMenus = getMenusService;

interface AddMenu {
  (
    prisma: PrismaClient,
    input: CreateMenuInput,
    corporation_id: string
  ): Promise<Menu>;
}

interface UploadMenuImage {
  (corporation_id: string, menu_id: number): Promise<PresignedPost>;
}

interface SetMenuHasImage {
  (prisma: PrismaClient, menu_id: number): Promise<Menu>;
}

interface AddImageUrl {
  (menus: Menu[]): MenuWithUrl[];
}

interface GetMenus {
  (prisma: PrismaClient, corporation_id: string): Promise<Menu[]>;
}

export type CreateMenuInput = z.TypeOf<typeof createMenuSchema>;

export type UploadImageInput = z.TypeOf<typeof uploadImageSchema>;

export type MenuWithUrl = Menu & { url: string };
