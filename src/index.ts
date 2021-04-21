import {ApolloServer} from "apollo-server";

import typeDefs from "./apiSchema";
import {locations} from "./resolvers/locations";
import { connection } from "./db";
import { photo } from "./resolvers/photos";

const main = async () => {
    const orm = await connection();
    
    const resolvers = {
        Query: {
            locations: () => locations(orm),
            photo: (_: any, {slug} : {slug: string}) => photo(orm, slug)
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
