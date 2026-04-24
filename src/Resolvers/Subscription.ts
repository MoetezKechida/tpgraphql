import { GraphQLContext } from "../types";

export const Subscription: any = {
  cv: {
    subscribe: (_: unknown, __: unknown, { pubSub }: GraphQLContext) =>
      pubSub.subscribe("cv"),
    resolve: (payload: unknown) => payload,
  },
};
