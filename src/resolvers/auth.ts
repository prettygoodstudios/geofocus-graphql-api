import { LoginResolver, ProfileInfo, RegisterResolver, StandardResolver, UpdateProfileResolver } from "../types";
import { compare, hash } from "bcrypt";
import User from "../models/user";
import { clearTokens, generateTokens } from "../auth";
import { ApolloError } from "apollo-server-errors";
import { buildProfileAWSPath, SALT } from "../config";
import { validateFields } from "../helpers";
import slugify from "slugify";
import { uploadToS3 } from "../uploader";
import { Connection } from "typeorm";


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

const updateUser = async (user: User, {email, password, display, bio, file, zoom, width, height, offsetX, offsetY}: ProfileInfo, orm: Connection): Promise<User> => {
    user.email = email;
    if((!password || password.length < 6) && !user.encrypted_password){
        throw new ApolloError("Must provide a password that is atleast six characters in length.", REGISTER_ERROR);
    }
    user.encrypted_password = await hash(password, SALT()) || user.encrypted_password;
    user.display = display || user.display;
    user.bio = bio || user.bio;
    user.zoom = zoom || user.zoom;
    user.width = Math.floor(width) || user.width;
    user.height = Math.floor(height) || user.height;
    user.offsetX = Math.floor(offsetX) || user.offsetX;
    user.offsetY = Math.floor(offsetY) || user.offsetY;
    user.slug = user.slug || (user.display ? slugify(user.display) : '');
    user.created_at = user.created_at || new Date();
    user.updated_at = new Date();
    await validateFields(user);

    try {
        await orm
            .manager
            .getRepository(User)
            .save(user);
    } catch (error) {
        throw new ApolloError(`Either your email or display name has already been taken.`, REGISTER_ERROR);
    }
    try {
        if (file || !user.profile_img) {
            user.profile_img = await uploadToS3(file, buildProfileAWSPath, user.id);
            await orm
                .manager
                .getRepository(User)
                .save(user);
        }
    } catch(error) {
        throw new ApolloError(`You must provide a profile picture.`, REGISTER_ERROR);
    } 

    return user;
}

const REGISTER_ERROR = 'REGISTER_ERROR';
export const register: RegisterResolver = async (parent, data, {orm, res}) => {
    const user = await updateUser(new User(), data, orm);
    generateTokens(user, res);
    return user;
}

export const editProfile: UpdateProfileResolver = async (parent, data, {orm}) => {
    const user = await updateUser(await orm 
        .getRepository(User)
        .findOneOrFail({
            slug: data.slug
        }),
        data,
        orm);
    return user;
}

export const logout: StandardResolver<void> = async (parent, args, {orm, res}) => {
    clearTokens(res);
}