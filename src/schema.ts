import{ createSchema} from"graphql-yoga";
import { Query } from "./Resolvers/Query";
import { Mutation } from "./Resolvers/Mutation";
import { Infos } from "./Resolvers/Infos";
import { InfosGeneral } from "./Resolvers/InfosGeneral";
import { Cv } from "./Resolvers/Cv";
import { User } from "./Resolvers/User";
import { Subscription } from "./Resolvers/Subscription";





const fs=require("fs");
const path=require("path");
export const schema=createSchema({
    typeDefs:fs.readFileSync(
        path.join(__dirname, "./../schema/schema.graphql"),
        "utf-8"
    ),
    resolvers:{
        Query,
        Mutation,
        Subscription,
        Infos,
        Cv,
        InfosGeneral,
        User,
    },
});
