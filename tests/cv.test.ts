import { beforeEach, describe, expect, it, vi } from "vitest";
import { Query } from "../src/Resolvers/Query";
import { Mutation } from "../src/Resolvers/Mutation";
import { Cv } from "../src/Resolvers/Cv";
import { User } from "../src/Resolvers/User";
import { Skill } from "../src/Resolvers/Skill";
import { DB } from "../src/db/db";
import { MutationType, type GraphQLContext } from "../src/types";

function createContext(): GraphQLContext {
  const db = structuredClone(DB);
  return {
    db,
    pubSub: {
      publish: async () => undefined,
      subscribe: () => ({}) as never,
    } as GraphQLContext["pubSub"],
  };
}

describe("CV resolvers", () => {
  let context: GraphQLContext;

  beforeEach(() => {
    context = createContext();
  });

  it("returns all cvs", () => {
    const result = Query.cvs(null, null, context);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
  });

  it("returns one cv by id", () => {
    const result = Query.cv(null, { id: 1 }, context);

    expect(result?.name).toBe("John Doe");
  });

  it("adds a cv and publishes a created event", () => {
    const publishSpy = vi.fn();
    context.pubSub.publish = publishSpy as GraphQLContext["pubSub"]["publish"];

    const result = Mutation.addCv(
      null,
      { input: { name: "New CV", userId: 1, skillIds: [1], age: 20, job: "Dev" } },
      context
    );

    expect(result.id).toBeGreaterThan(0);
    expect(context.db.cvs).toContainEqual(result);
    expect(publishSpy).toHaveBeenCalledWith("cv", {
      mutation: MutationType.CREATED,
      cv: result,
    });
  });

  it("updates a cv and publishes an updated event", () => {
    const publishSpy = vi.fn();
    context.pubSub.publish = publishSpy as GraphQLContext["pubSub"]["publish"];

    const result = Mutation.updateCv(
      null,
      { id: 1, input: { name: "Updated name", skillIds: [1, 2] } },
      context
    );

    expect(result.name).toBe("Updated name");
    expect(publishSpy).toHaveBeenCalledWith("cv", {
      mutation: MutationType.UPDATED,
      cv: result,
    });
  });

  it("soft deletes a cv and publishes a deleted event", () => {
    const publishSpy = vi.fn();
    context.pubSub.publish = publishSpy as GraphQLContext["pubSub"]["publish"];

    const result = Mutation.deleteCv(null, { id: 1 }, context);

    expect(result.deletedAt).not.toBeNull();
    expect(publishSpy).toHaveBeenCalledWith("cv", {
      mutation: MutationType.DELETED,
      cv: result,
    });
  });

  it("resolves cv skills and user", () => {
    const cv = Query.cv(null, { id: 1 }, context)!;

    expect(Cv.skills(cv, null, context)).toHaveLength(2);
    expect(Cv.user(cv, null, context)?.email).toBe("john.doe@example.com");
  });

  it("resolves user cvs", () => {
    const user = context.db.users.find((entry) => entry.id === 1)!;
    const result = User.cv(user, null, context);

    expect(result.map((entry) => entry.id).sort()).toEqual([1, 3]);
  });

  it("resolves skill cvs", () => {
    const skill = context.db.skills.find((entry) => entry.id === 2)!;
    const result = Skill.cvs(skill, null, context);

    expect(result.map((entry) => entry.id).sort()).toEqual([1, 2]);
  });
});
