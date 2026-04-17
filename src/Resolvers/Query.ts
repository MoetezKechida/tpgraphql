import { Cv } from "./Cv";

export const Query = {
    cv: (_, { id }, { db }) => db.cvs.find((cv) => cv.id === id),
    cvs: (_, __, { db }) => [...db.cvs],
}
