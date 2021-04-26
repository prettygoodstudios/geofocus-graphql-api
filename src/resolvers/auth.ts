import { LoginResolver, StandardResolver } from "../types";
import {compare} from "bcrypt";
import User from "../models/user";
import { clearTokens, generateTokens } from "../auth";
import { ApolloError } from "apollo-server-errors";


const AUTH_ERROR = 'AUTH_ERROR';
export const AuthError = (message: string) => {
    throw new ApolloError(message, AUTH_ERROR);
}


export const login: LoginResolver = async (parent, {email, password}, {orm, res}) => {
    try {
        const user = await orm 
            .manager 
            .connection 
            .getRepository(User)
            .findOneOrFail({
                where: {
                    email
                },
                relations: ["photos", "photos.user", "photos.location"]
            });

        
            
        if(await compare(password, user.encrypted_password)){
            generateTokens(user, res);
            return user;
        }
    } catch {
        AuthError("Invalid credential provided.");
    }
    AuthError("Invalid credential provided.");
    return null;
}

export const logout: StandardResolver<void> = async (parent, args, {orm, res}) => {
    clearTokens(res);
}