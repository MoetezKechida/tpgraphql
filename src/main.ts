import "dotenv/config";
import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { schema } from "./schema";
import { PrismaClient } from "./generated/prisma/client";
import {pubsub} from "./pubsub";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const yoga = createYoga({
  schema,
  context: () => ({ prisma, pubsub }) as any,
});
const server = createServer(yoga);

server.listen(4000, () => {
  console.info(`Server is running on http://localhost:4000/graphql`);
});
