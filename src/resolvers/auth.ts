import { LoginResolver, RegisterResolver, StandardResolver } from "../types";
import {compare, hash} from "bcrypt";
import User from "../models/user";
import { clearTokens, generateTokens } from "../auth";
import { ApolloError } from "apollo-server-errors";
import { SALT } from "../config";
import { validate } from "class-validator";
import { humanReadableList } from "../helpers";
import slugify from "slugify";


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

const REGISTER_ERROR = 'REGISTER_ERROR';
export const register: RegisterResolver = async (parent, {email, password, display, bio, img, zoom, width, height, offsetX, offsetY}, {orm, res}) => {
    const user = new User();
    user.email = email;
    user.encrypted_password = await hash(password, SALT);
    user.display = display;
    user.bio = bio;
    user.zoom = zoom;
    user.width = width;
    user.height = height;
    user.offsetX = offsetX;
    user.offsetY = offsetY;
    user.slug = slugify(user.display);

    const errors = await validate(user);

    if (errors.length > 0) {
        throw new ApolloError(`The following failed validation ${humanReadableList(errors.map(e => e.property))}`, REGISTER_ERROR);
    }

    await orm
        .manager
        .getRepository(User)
        .save(user);
    
    

    return null;
}

export const logout: StandardResolver<void> = async (parent, args, {orm, res}) => {
    clearTokens(res);
}