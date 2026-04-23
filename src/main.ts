import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { DB } from "./db/db";
import { pubSub } from "./schema";




const yoga = createYoga<{}, any>({ schema, context: { db: DB } });
const server = createServer(yoga);

server.listen(4000, () => {
  console.info(`Server is running on http://localhost:4000/graphql`);
});
