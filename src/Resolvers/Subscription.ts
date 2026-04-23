import { GraphQLContext } from "../types";

export const Subscription = {
  cvAdded: {
    subscribe: (_: unknown, __: unknown, { pubSub }: GraphQLContext) =>
      pubSub.subscribe("cvAdded"),
    resolve: (payload: any) => payload,
  },
  cvUpdated: {
    subscribe: (_: unknown, __: unknown, { pubSub }: GraphQLContext) =>
      pubSub.subscribe("cvUpdated"),
    resolve: (payload: any) => payload,
  },
  cvDeleted: {
    subscribe: (_: unknown, __: unknown, { pubSub }: GraphQLContext) =>
      pubSub.subscribe("cvDeleted"),
    resolve: (payload: any) => payload,
  },
};
