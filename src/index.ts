import {ApolloServer, gql} from "apollo-server";
import typeDefs from "./apiSchema";
import {locations} from "./resolvers/locations";


const resolvers = {
    Query: {
        locations
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});