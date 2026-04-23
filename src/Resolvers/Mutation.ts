import { pubSub } from "../schema";

export const Mutation = {
    addCv: (_: any, { input }: { input: any }, { db }: { db: any }) => {
        const user = db.users.find((u: any) => u.id === input.userId);
        if (!user) {
            throw new Error(`User with id ${input.userId} not found.`);
        }

        for (const skillId of input.skillIds) {
            const skill = db.skills.find((s: any) => s.id === skillId);
            if (!skill) {
                throw new Error(`Skill with id ${skillId} not found.`);
            }
        }

        const newCv = {
            id: db.cvs.length > 0
                ? Math.max(...db.cvs.map((c: any) => c.id)) + 1
                : 1,
            name: input.name,
            age: input.age ?? null,
            job: input.job ?? null,
            skills: input.skillIds,
            user: input.userId,
            deletedAt: null,
        };

        db.cvs.push(newCv);

        user.cv = [...(user.cv ?? []), newCv.id];

        pubSub.publish("cv", { cv:{ mutation: "CREATED", cv: newCv } });
        return newCv;
    },
    updateCv: (_: any, { id, input }: { id: number; input: any }, { db }: { db: any }) => {
        const cvIndex = db.cvs.findIndex((c: any) => c.id === id);
        if (cvIndex === -1) {
            throw new Error(`CV with id ${id} not found.`);
        }

        const cv = db.cvs[cvIndex];
        if (cv.deletedAt !== null && cv.deletedAt !== undefined) {
            throw new Error(`CV with id ${id} has been deleted and cannot be updated.`);
        }
        if (input.userId !== undefined && input.userId !== null) {
            const user = db.users.find((u: any) => u.id === input.userId);
            if (!user) {
                throw new Error(`User with id ${input.userId} not found.`);
            }
        }

        if (input.skillIds !== undefined && input.skillIds !== null) {
            for (const skillId of input.skillIds) {
                const skill = db.skills.find((s: any) => s.id === skillId);
                if (!skill) {
                    throw new Error(`Skill with id ${skillId} not found.`);
                }
            }
        }

        const updatedCv = {
            ...cv,
            name: input.name ?? cv.name,
            age: input.age !== undefined ? input.age : cv.age,
            job: input.job !== undefined ? input.job : cv.job,
            user: input.userId ?? cv.user,
            skills: input.skillIds ?? cv.skills,
        };

        db.cvs[cvIndex] = updatedCv;
        pubSub.publish("cv", { cv: { mutation: "UPDATED", cv: updatedCv } });
        return updatedCv;
    },

    deleteCv: (_: any, { id }: { id: number }, { db }: { db: any }) => {
        const cvIndex = db.cvs.findIndex((c: any) => c.id === id);
        if (cvIndex === -1) {
            throw new Error(`CV with id ${id} not found.`);
        }
        const cv = db.cvs[cvIndex];

        if (cv.deletedAt !== null && cv.deletedAt !== undefined) {
            throw new Error(`CV with id ${id} is already deleted.`);
        }

        const deletedCv = {
            ...cv,
            deletedAt: new Date().toISOString(),
        };

        db.cvs[cvIndex] = deletedCv;
        pubSub.publish("cv", { cv: { mutation: "DELETED", cv: deletedCv } });
        return deletedCv;
    },
};
