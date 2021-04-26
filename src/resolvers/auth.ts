import { LoginResolver } from "../types";
import {compare} from "bcrypt";
import User from "../models/user";
import {sign} from "jsonwebtoken";
import { SECRET } from "../config";


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
    
        const refresh = sign(tokenObject, SECRET, {
            expiresIn: "7d"
        });
    
        const auth = sign(tokenObject, SECRET, {
            expiresIn: "15min"
        });
        
        res.cookie("refresh-token", refresh);
        res.cookie("auth-token", auth);
        return user;
    }

    return null;
}