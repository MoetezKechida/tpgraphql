import {
  GraphQLContext,
  CreateCvInput,
  UpdateCvInput,
  CvRecord,
  MutationType,
} from "../types";
import {
  getNextCvId,
  linkCvToUser,
  moveCvToUser,
  publishCvEvent,
  requireActiveCv,
  requireSkills,
  requireUser,
  unlinkCvFromUser,
} from "../services/cvService";

export const Mutation = {
  addCv: (_: unknown, { input }: { input: CreateCvInput }, { db, pubSub }: GraphQLContext): CvRecord => {
    const user = requireUser(db, input.userId);
    requireSkills(db, input.skillIds);

    const nextCvId = getNextCvId(db);

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

    linkCvToUser(user, newCv.id);

    publishCvEvent(pubSub, MutationType.CREATED, newCv);

    return newCv;
  },

  updateCv: (_: unknown, { id, input }: { id: number; input: UpdateCvInput }, { db, pubSub }: GraphQLContext): CvRecord => {
    const { cv, cvIndex } = requireActiveCv(db, id, "Cannot update a deleted CV");

    if (input.userId !== undefined && input.userId !== null && input.userId !== cv.user) {
      moveCvToUser(db, id, cv.user, input.userId);
    }

    if (input.skillIds !== undefined && input.skillIds !== null) {
      requireSkills(db, input.skillIds);
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

    publishCvEvent(pubSub, MutationType.UPDATED, updatedCv);

    return updatedCv;
  },

  deleteCv: (_: unknown, { id }: { id: number }, { db, pubSub }: GraphQLContext): CvRecord => {
    const { cv, cvIndex } = requireActiveCv(db, id, "CV already deleted");

    const deletedCv: CvRecord = {
      ...cv,
      deletedAt: new Date().toISOString(),
    };

    unlinkCvFromUser(db.users.find((entry) => entry.id === cv.user), id);

    db.cvs[cvIndex] = deletedCv;

    publishCvEvent(pubSub, MutationType.DELETED, deletedCv);

    return deletedCv;
  },
};
