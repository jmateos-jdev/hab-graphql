import merge from "lodash.merge";
import { userResolvers } from "./user.resolver.js";
import { entryResolvers } from "./entry.resolver.js";

export const resolvers = merge(userResolvers, entryResolvers);
