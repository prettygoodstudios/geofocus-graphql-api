import {ApolloServer} from "apollo-server";

import typeDefs from "./apiSchema";
import { connection } from "./db";

import {locations, location} from "./resolvers/locations";
import { photo } from "./resolvers/photos";
import {users} from "./resolvers/users";

const main = async () => {
    const orm = await connection();
    
    const resolvers = {
        Query: {
            locations: () => locations(orm),
            location: (_: any, {slug} : {slug: string}) => location(orm, slug),
            photo: (_: any, {slug} : {slug: string}) => photo(orm, slug),
            users: () => users(orm)
        }
    }

    
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers
    });
    
    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
}

main();
