import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import path from "path";
import { resolvers } from "./resolvers/index.resolver.js";

const schema = await loadSchema(
  path.join(process.cwd(), "./schemas/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()]
  }
);

const server = new ApolloServer({ typeDefs: schema, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Servidor corriendo en ${url}`);
