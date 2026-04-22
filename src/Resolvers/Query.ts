export const Query = {
    cv: async (_: any, { id }: { id?: number }, { prisma }: { prisma: any }) => {
        if (id === undefined || id === null) return null;

        return prisma.cv.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    },
    cvs: async (_: any, __: any, { prisma }: { prisma: any }) =>
        prisma.cv.findMany({
            where: { deletedAt: null },
            orderBy: { id: "asc" },
        }),
}
