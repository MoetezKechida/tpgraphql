import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/db/prisma";

describe("Prisma data model", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.cvSkill.deleteMany();
    await prisma.cv.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.cvSkill.deleteMany();
    await prisma.cv.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("creates a cv with linked user and skills", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test.user@example.com",
        role: "USER",
      },
    });

    const skill = await prisma.skill.create({
      data: {
        designation: "prisma",
      },
    });

    const cv = await prisma.cv.create({
      data: {
        name: "Prisma CV",
        age: 32,
        job: "Developer",
        user: {
          connect: { id: user.id },
        },
        skills: {
          create: [
            {
              skill: {
                connect: { id: skill.id },
              },
            },
          ],
        },
      },
      include: {
        user: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    expect(cv.user.email).toBe("test.user@example.com");
    expect(cv.skills).toHaveLength(1);
    expect(cv.skills[0].skill.designation).toBe("prisma");
  });
});
