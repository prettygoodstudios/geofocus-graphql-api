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
import { generateTokens } from "./auth";
import User from "./models/user";
import * as cors from "cors";

const main = async () => {
    const orm = await connection();
    
    const resolvers = {
        Query: {
            locations,
            location,
            photo,
            topUsers,
            user,
            me
        },
        Mutation: {
            login
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

    app.use(cors({
        origin: 'http://localhost:3030',
        credentials: true // <-- REQUIRED backend setting
    }));

    app.use(cookieParser());

    app.use((req: any, res, next) => {
        const accessToken = req.cookies['auth-token'];
        const refreshToken = req.cookies['refresh-token'];
        if(!accessToken || !refreshToken) {
            return next();
        }
        try {
            const userData: any = verify(accessToken, SECRET);
            req.userId = userData.userId;
            return next();
        } catch {
            
        }
        try {
            const userData: any = verify(refreshToken, SECRET);
            req.userId = userData.userId;
            generateTokens({
                id: userData.userId
            } as User, res);
        } catch {
            return next();
        }
        next();
    });

    server.applyMiddleware({ app, cors: false });

    
    
    // The `listen` method launches a web server.
    app.listen({port: 4000}, () => {
      console.log(`🚀  Server ready`);
    });
}

main();
