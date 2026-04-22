import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const [typescript, graphql, nodejs] = await Promise.all([
		prisma.skill.upsert({
			where: { designation: "typescript" },
			update: {},
			create: { designation: "typescript" },
		}),
		prisma.skill.upsert({
			where: { designation: "graphql" },
			update: {},
			create: { designation: "graphql" },
		}),
		prisma.skill.upsert({
			where: { designation: "nodejs" },
			update: {},
			create: { designation: "nodejs" },
		}),
	]);

	const [john, jane] = await Promise.all([
		prisma.user.upsert({
			where: { email: "john.doe@example.com" },
			update: { name: "John Doe", role: Role.USER },
			create: {
				name: "John Doe",
				email: "john.doe@example.com",
				role: Role.USER,
			},
		}),
		prisma.user.upsert({
			where: { email: "jane.smith@example.com" },
			update: { name: "Jane Smith", role: Role.ADMIN },
			create: {
				name: "Jane Smith",
				email: "jane.smith@example.com",
				role: Role.ADMIN,
			},
		}),
	]);

	// Keep seeding idempotent by replacing previous CV rows.
	await prisma.cv.deleteMany();

	await prisma.cv.create({
		data: {
			name: "John Doe",
			age: 30,
			job: "Software Engineer",
			userId: john.id,
			skills: { connect: [{ id: typescript.id }, { id: graphql.id }] },
		},
	});

	await prisma.cv.create({
		data: {
			name: "Jane Smith",
			age: 25,
			job: "Product Manager",
			userId: jane.id,
			skills: { connect: [{ id: graphql.id }, { id: nodejs.id }] },
		},
	});

	console.log("Database seeded successfully");
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
