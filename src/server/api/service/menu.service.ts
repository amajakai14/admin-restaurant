import { type PresignedPost } from "@aws-sdk/s3-presigned-post";
import { type Menu, type PrismaClient } from "@prisma/client";
import { env } from "../../../env.mjs";
import { putObjectPresignedUrl } from "../../../utils/s3";
import {
  type CreateMenuInput,
  type MenuWithUrl,
} from "../repository/menu.repository";

export async function addMenuService(
  prisma: PrismaClient,
  input: CreateMenuInput,
  corporation_id: string
): Promise<Menu> {
  const { menu_name_en, menu_name_th, menu_type, price, priority, hasImage } =
    input;
  const menu = await prisma.menu.create({
    data: {
      menu_name_en,
      menu_name_th,
      menu_type,
      price,
      priority,
      Corporation: {
        connect: {
          id: corporation_id,
        },
      },
      hasImage,
    },
  });
  return menu;
}

export async function uploadMenuImageService(
  corporation_id: string,
  menu_id: number
): Promise<PresignedPost> {
  return await putObjectPresignedUrl(corporation_id, menu_id);
}

export async function setMenuHasImageService(
  prisma: PrismaClient,
  menu_id: number
): Promise<Menu> {
  return await prisma.menu.update({
    where: { id: menu_id },
    data: { hasImage: true },
  });
}

export function addMenuImageURLService(menus: Menu[]): MenuWithUrl[] {
  return menus.map((menu) => {
    let url =
      env.CLOUDFRONT_URL + menu.corporation_id + "/" + menu.id.toString();
    if (!menu.hasImage) url = env.CLOUDFRONT_URL + "noimage.jpeg";
    return {
      ...menu,
      url,
    };
  });
}
