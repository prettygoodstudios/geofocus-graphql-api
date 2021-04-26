import { LoginResolver, StandardResolver } from "../types";
import {compare} from "bcrypt";
import User from "../models/user";
import { clearTokens, generateTokens } from "../auth";


export const login: LoginResolver = async (parent, {email, password}, {orm, res}) => {
    const user = await orm 
        .manager 
        .connection 
        .getRepository(User)
        .findOneOrFail({
            where: {
                email
            }
        });

    
        
    if(await compare(password, user.encrypted_password)){
        const tokenObject = {
            userId: user.id,
            userEmail: user.email,
            userSlug: user.slug
        }
        generateTokens(user, res);
        return user;
    }

    return null;
}

export const logout: StandardResolver<void> = async (parent, args, {orm, res}) => {
    clearTokens(res);
}