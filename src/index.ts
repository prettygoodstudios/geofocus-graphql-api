import {ApolloServer} from "apollo-server-express";

import typeDefs from "./apiSchema";
import { connection } from "./db";

import {locations, location} from "./resolvers/locations";
import { photo } from "./resolvers/photos";
import {topUsers, user, me} from "./resolvers/users";
import { ApolloContext } from "./types";
import { login } from "./resolvers/auth";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { SECRET } from "./config";

const main = async () => {
    const orm = await connection();
    
    const resolvers = {
        Query: {
            locations,
            location,
            photo,
            topUsers,
            user,
            login,
            me
        }
    }

    const app = express();

    
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context: ({req, res}): ApolloContext => {
            return {
                orm,
                req,
                res
            }
        }
    });

    app.use(cookieParser());

    app.use((req: any, res, next) => {
        const accessToken = req.cookies['auth-token'];
        const refreshToken = req.cookies['refresh-token'];
        try {
            const userData: any = verify(accessToken, SECRET);
            req.userId = userData.userId;
        } catch {

        }
        next();
    });

    server.applyMiddleware({ app });

    
    
    // The `listen` method launches a web server.
    app.listen({port: 4000}, () => {
      console.log(`🚀  Server ready`);
    });
}

main();
