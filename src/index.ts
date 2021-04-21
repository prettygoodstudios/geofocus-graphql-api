import {ApolloServer} from "apollo-server";
import {createConnection, Connection} from "typeorm";

import typeDefs from "./apiSchema";
import {locations} from "./resolvers/locations";
import Location from "./models/location";
import { connection } from "./db";

const main = async () => {
    const orm = await connection();

    const locos = await orm.manager.find(Location);
    console.log(locos);
    
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
}

main();
