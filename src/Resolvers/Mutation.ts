import {
  GraphQLContext,
  CreateCvInput,
  UpdateCvInput,
  CvRecord,
  MutationType,
} from "../types";

export const Mutation = {
  addCv: (_: unknown, { input }: { input: CreateCvInput }, { db, pubSub }: GraphQLContext): CvRecord => {
    const user = db.users.find((u) => u.id === input.userId);
    if (!user) {
      throw new Error("User not found");
    }

    for (const skillId of input.skillIds) {
      const skill = db.skills.find((s) => s.id === skillId);
      if (!skill) {
        throw new Error("One or more skills not found");
      }
    }

    const nextCvId = db.cvs.length > 0 
      ? Math.max(...db.cvs.map((c) => c.id)) + 1 
      : 1;

    const newCv: CvRecord = {
      id: nextCvId,
      name: input.name,
      age: input.age ?? null,
      job: input.job ?? null,
      skills: input.skillIds,
      user: input.userId,
      deletedAt: null,
    };

    db.cvs.push(newCv);

    user.cv = [...(user.cv ?? []), newCv.id];

    pubSub.publish("cv", { mutation: MutationType.CREATED, cv: newCv });

    return newCv;
  },

  updateCv: (_: unknown, { id, input }: { id: number; input: UpdateCvInput }, { db, pubSub }: GraphQLContext): CvRecord => {
    const cvIndex = db.cvs.findIndex((c) => c.id === id);
    if (cvIndex === -1) {
      throw new Error("CV not found");
    }

    const cv = db.cvs[cvIndex];
    if (cv.deletedAt !== null) {
      throw new Error("Cannot update a deleted CV");
    }

    if (input.userId !== undefined && input.userId !== null && input.userId !== cv.user) {
      const newUser = db.users.find((u) => u.id === input.userId);
      if (!newUser) {
        throw new Error("User not found");
      }
      
      // Remove from old user
      const oldUser = db.users.find((u) => u.id === cv.user);
      if (oldUser) {
        oldUser.cv = (oldUser.cv || []).filter((cvId) => cvId !== id);
      }
      
      // Add to new user
      newUser.cv = [...(newUser.cv ?? []), id];
    }

    if (input.skillIds !== undefined && input.skillIds !== null) {
      for (const skillId of input.skillIds) {
        const skill = db.skills.find((s) => s.id === skillId);
        if (!skill) {
          throw new Error("One or more skills not found");
        }
      }
    }

    const updatedCv: CvRecord = {
      ...cv,
      name: input.name ?? cv.name,
      age: input.age !== undefined ? input.age : cv.age,
      job: input.job !== undefined ? input.job : cv.job,
      user: input.userId ?? cv.user,
      skills: input.skillIds ?? cv.skills,
    };

    db.cvs[cvIndex] = updatedCv;

    pubSub.publish("cv", { mutation: MutationType.UPDATED, cv: updatedCv });

    return updatedCv;
  },

  deleteCv: (_: unknown, { id }: { id: number }, { db, pubSub }: GraphQLContext): CvRecord => {
    const cvIndex = db.cvs.findIndex((c) => c.id === id);
    if (cvIndex === -1) {
      throw new Error("CV not found");
    }
    const cv = db.cvs[cvIndex];

    if (cv.deletedAt !== null) {
      throw new Error("CV already deleted");
    }

    const deletedCv: CvRecord = {
      ...cv,
      deletedAt: new Date().toISOString(),
    };

    db.cvs[cvIndex] = deletedCv;

    pubSub.publish("cv", { mutation: MutationType.DELETED, cv: deletedCv });

    return deletedCv;
    },
};
