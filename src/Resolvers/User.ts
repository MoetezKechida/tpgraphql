export const User = {
    cv: (parent: any, _: any, { prisma }: { prisma: any }) => {
        return prisma.user
            .findUnique({ where: { id: parent.id } })
            .cvs({
                where: { deletedAt: null },
                orderBy: { id: "asc" },
            });
    },
};