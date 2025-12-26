import { prisma, withCursorPagination } from "@shadcnrss/db";
import { z } from "zod";
import { type ListResponse, createListResponse } from "./shared";

export const RegistriesList = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    url: z.string(),

    repo: z
      .object({
        stars: z.number(),
        url: z.string(),
        name: z.string(),
      })
      .nullable(),

    item: z.number().nullable(),
  })
);

export const GetRegistryParams = z.object({
  cursor: z.number().nullable(),
});

// TODO: filters
export const getRegistries = async ({
  cursor,
}: z.infer<typeof GetRegistryParams>): Promise<
  ListResponse<z.infer<typeof RegistriesList>>
> => {
  const result = await withCursorPagination(() =>
    prisma.registry.findMany({
      take: 2,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        repos: true,
        _count: {
          select: { items: true },
        },
      },
    })
  );

  return createListResponse(
    result.data.map((registry) => ({
      id: registry.id,
      name: registry.name,
      description: registry.description,
      url: registry.url,
      repo: registry.repos
        ? {
            stars: registry.repos.stars || 0,
            url: registry.repos.url,
            name: registry.repos.name,
          }
        : null,
      item: registry._count.items,
    })),
    result.nextCursor
  );
};
