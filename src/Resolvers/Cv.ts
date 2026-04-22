export const Cv = {
    skills: (parent: any, _: any, { prisma }: { prisma: any }) => {
        return prisma.cv.findUnique({ where: { id: parent.id } }).skills();
    },
    user: (parent: any, _: any, { prisma }: { prisma: any }) => {
        return prisma.cv.findUnique({ where: { id: parent.id } }).user();
    },
    deletedAt: (parent: any) => {
        if (!parent.deletedAt) return null;
        return parent.deletedAt instanceof Date
            ? parent.deletedAt.toISOString()
            : new Date(parent.deletedAt).toISOString();
    },
};