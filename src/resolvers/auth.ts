import { LoginResolver, RegisterResolver, StandardResolver } from "../types";
import {compare, hash} from "bcrypt";
import User from "../models/user";
import { clearTokens, generateTokens } from "../auth";
import { ApolloError } from "apollo-server-errors";
import { buildProfileAWSPath, SALT } from "../config";
import { validate } from "class-validator";
import { humanReadableList } from "../helpers";
import slugify from "slugify";
import { uploadToS3 } from "../uploader";


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
export const register: RegisterResolver = async (parent, {email, password, display, bio, file, zoom, width, height, offsetX, offsetY}, {orm, res}) => {
    console.log("It hit the register resolver")
    const user = new User();
    user.email = email;
    user.encrypted_password = await hash(password, SALT());
    user.display = display;
    user.bio = bio;
    user.zoom = zoom;
    user.width = Math.floor(width);
    user.height = Math.floor(height);
    user.offsetX = Math.floor(offsetX);
    user.offsetY = Math.floor(offsetY);
    user.slug = slugify(user.display);
    user.created_at = new Date();
    user.updated_at = new Date();

    const errors = await validate(user);

    if (errors.length > 0) {
        throw new ApolloError(`The following failed validation ${humanReadableList(errors.map(e => e.property))}`, REGISTER_ERROR);
    }

    try {
        await orm
            .manager
            .getRepository(User)
            .save(user);
    } catch (error) {
        throw new ApolloError(`Either your email or display name has already been taken.`, REGISTER_ERROR);
    }
    
    user.profile_img = await uploadToS3(file, buildProfileAWSPath, user.id);

    await orm
        .manager
        .getRepository(User)
        .save(user);

    generateTokens(user, res);

    return user;
}

export const logout: StandardResolver<void> = async (parent, args, {orm, res}) => {
    clearTokens(res);
}