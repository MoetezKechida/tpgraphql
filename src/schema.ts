import { createSchema } from "graphql-yoga";
import { Query } from "./Resolvers/Query";
import { Mutation } from "./Resolvers/Mutation";
import { Subscription } from "./Resolvers/Subscription";
import { Infos } from "./Resolvers/Infos";
import { InfosGeneral } from "./Resolvers/InfosGeneral";
import { Cv } from "./Resolvers/Cv";
import fs from "fs";
import path from "path";

export const schema: any = createSchema({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "./../schema/schema.graphql"),
    "utf-8"
  ),
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Infos,
    Cv,
    InfosGeneral,
  },
});
