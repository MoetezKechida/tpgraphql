import { createServer } from "node:http";
import { createYoga, createPubSub } from "graphql-yoga";
import { schema } from "./schema";
import { DB } from "./db/db";
import { PubSubEvents } from "./types";

const pubSub = createPubSub<PubSubEvents>();

const yoga = createYoga({ 
  schema, 
  context: { db: DB, pubSub } 
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info(`Server is running on http://localhost:4000/graphql`);
});
