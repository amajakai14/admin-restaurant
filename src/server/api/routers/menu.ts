import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isValidPrice } from "../../../utils/input.validation";
import * as repository from "../repository/menu.repository";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const menuType = ["APPETIZER", "MAIN", "DESSERT", "DRINK"] as const;

export const createMenuSchema = z.object({
  menu_name_en: z.string(),
  menu_name_th: z.string(),
  menu_type: z.enum(menuType),
  price: z.number().positive(),
  hasImage: z.boolean(),
  priority: z.number().nullable(),
});

export const uploadImageSchema = z.object({
  id: z.number(),
});

export const menuRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createMenuSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (!isValidPrice(input.price)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "price should be a number",
        });
      }

      const menu = await repository.addMenu(ctx.prisma, input, corporation_id);
      if (!input.hasImage) return;

      return await repository.uploadMenuImage(corporation_id, menu.id);
    }),

  uploadImage: protectedProcedure
    .input(uploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const { id } = input;

      const setMenuHasImagePromise = repository.setMenuHasImage(ctx.prisma, id);
      const uploadMenuImagePromise = repository.uploadMenuImage(
        corporation_id,
        id
      );

      const [setMenuHasImage, uploadMenuImage] = await Promise.allSettled([
        setMenuHasImagePromise,
        uploadMenuImagePromise,
      ]);

      if (
        setMenuHasImage.status === "rejected" ||
        uploadMenuImage.status === "rejected"
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }

      return {
        result: uploadMenuImage,
      };
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const menus = await ctx.prisma.menu.findMany({
      where: { corporation_id },
      orderBy: { id: "asc" },
    });

    return repository.addImageUrl(menus);
  }),
});
