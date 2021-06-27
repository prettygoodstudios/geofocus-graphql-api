import { buildPhotoAWSPath } from "../config";
import Photo from "../models/photo";
import { PublicSlugResolver, StandardResolver } from "../types";
import slugify from "slugify";
import { validate } from "class-validator";
import { ApolloError } from "apollo-server-errors";
import { humanReadableList } from "../helpers";
import { AuthError } from "./auth";
import Location from  "../models/location";
import User from "../models/user";
import { deleteFromS3, uploadToS3 } from "../uploader";

export const photo: PublicSlugResolver<Promise<Photo|null>> = async (parent, {slug}, {orm})  => {    
    const photos = await orm
        .manager
        .connection
        .manager
        .getRepository(Photo)
        .find({
            where: {
                slug
            },
            relations: ["user", "location"]
        });

    if (photos.length > 0) {
        photos[0].views += 1;
        await orm 
            .manager
            .connection 
            .getRepository(Photo)
            .save(photos[0]);
    }
        
    return photos.length > 0 ? photos[0] : null;
}

const PHOTO_ERROR = 'PHOTO_ERROR';

export const upload: StandardResolver<Promise<Photo|null>> = async (parent, {file, location, width, height, offsetX, offsetY, caption, zoom}, {orm, req}) => {
    if (req.userId){
        const photo = new Photo;
        const user = await orm
            .getRepository(User)
            .findOneOrFail({
                where: {
                    id: req.userId
                }
            });
        photo.user = user;
        const foundLocation = await orm
            .getRepository(Location)
            .findOneOrFail({
                where: {
                    slug: location
                }
            });
        photo.location = foundLocation;
        photo.width = parseInt(width);
        photo.height = parseInt(height);
        photo.offsetX = parseInt(offsetX);
        photo.offsetY = parseInt(offsetY);
        photo.zoom = zoom;
        photo.views = 0;
        photo.caption = caption;
        photo.created_at = new Date();
        photo.updated_at = new Date();
        photo.slug = slugify(photo.caption+photo.location.title);
        const errors = await validate(photo);

        if (errors.length === 0){
            await orm 
                .manager 
                .getRepository(Photo)
                .save(photo);            
            photo.img_url = await uploadToS3(file, buildPhotoAWSPath, photo.id);
            await orm 
                .manager 
                .getRepository(Photo)
                .save(photo);
            return photo;
        } else {
            throw new ApolloError(`The following failed validation ${humanReadableList(errors.map(e => e.property))}`, PHOTO_ERROR);
        }
    }
    throw AuthError("You must be authenticated to upload an photo.");
}

export const deletePhoto: PublicSlugResolver<Promise<number|undefined|null>> = async (parent, {slug}, {orm, req}) => {
    if (req.userId) {
        try {
            const result = await orm
                .manager 
                .getRepository(Photo)
                .findOneOrFail({
                    slug,
                    user: {
                        id: req.userId
                    }
                });
            deleteFromS3(result.img_url);
            return (await orm
                .manager 
                .getRepository(Photo)
                .delete(result)).affected;
        } catch {
            throw new ApolloError("Photo does not exist.", PHOTO_ERROR);
        }
    }
    throw AuthError("You must be authenticated to perform this action.");
}