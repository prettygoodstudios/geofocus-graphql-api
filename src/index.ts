import {ApolloServer} from "apollo-server";

import typeDefs from "./apiSchema";
import { connection } from "./db";

import {locations, location} from "./resolvers/locations";
import { photo } from "./resolvers/photos";
import {topUsers, user} from "./resolvers/users";
import { ApolloContext } from "./types";

const main = async () => {
    const orm = await connection();
    
    const resolvers = {
        Query: {
            locations,
            location,
            photo,
            topUsers,
            user
        }
    }

    
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context: ({req}): ApolloContext => {
            return {
                orm
            }
        }
    });
    
    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
}

main();
