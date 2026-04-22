export const Mutation = {
    addCv: async (_: any, { input }: { input: any }, { prisma }: { prisma: any }) => {
        const user = await prisma.user.findUnique({ where: { id: input.userId } });
        if (!user) {
            throw new Error(`User with id ${input.userId} not found.`);
        }

        if (!Array.isArray(input.skillIds) || input.skillIds.length === 0) {
            throw new Error("At least one skillId is required.");
        }

        const skills = await prisma.skill.findMany({
            where: { id: { in: input.skillIds } },
            select: { id: true },
        });

        if (skills.length !== input.skillIds.length) {
            throw new Error("One or more skills were not found.");
        }

        return prisma.cv.create({
            data: {
                name: input.name,
                age: input.age ?? null,
                job: input.job ?? null,
                userId: input.userId,
                skills: {
                    connect: input.skillIds.map((id: number) => ({ id })),
                },
            },
        });
    },

    updateCv: async (_: any, { id, input }: { id: number; input: any }, { prisma }: { prisma: any }) => {
        const cv = await prisma.cv.findUnique({ where: { id } });
        if (!cv) {
            throw new Error(`CV with id ${id} not found.`);
        }
        if (cv.deletedAt) {
            throw new Error(`CV with id ${id} has been deleted and cannot be updated.`);
        }

        if (input.userId !== undefined && input.userId !== null) {
            const user = await prisma.user.findUnique({ where: { id: input.userId } });
            if (!user) {
                throw new Error(`User with id ${input.userId} not found.`);
            }
        }

        if (input.skillIds !== undefined && input.skillIds !== null) {
            const skills = await prisma.skill.findMany({
                where: { id: { in: input.skillIds } },
                select: { id: true },
            });

            if (skills.length !== input.skillIds.length) {
                throw new Error("One or more skills were not found.");
            }
        }

        return prisma.cv.update({
            where: { id },
            data: {
                name: input.name ?? undefined,
                age: input.age !== undefined ? input.age : undefined,
                job: input.job !== undefined ? input.job : undefined,
                userId: input.userId ?? undefined,
                skills: input.skillIds
                    ? { set: input.skillIds.map((skillId: number) => ({ id: skillId })) }
                    : undefined,
            },
        });
    },

    deleteCv: async (_: any, { id }: { id: number }, { prisma }: { prisma: any }) => {
        const cv = await prisma.cv.findUnique({ where: { id } });

        if (!cv) {
            throw new Error(`CV with id ${id} not found.`);
        }

        if (cv.deletedAt) {
            throw new Error(`CV with id ${id} is already deleted.`);
        }

        return prisma.cv.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
