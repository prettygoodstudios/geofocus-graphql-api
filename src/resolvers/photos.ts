import { buildPhotoAWSPath, s3 } from "../config";
import Photo from "../models/photo";
import {PassThrough, Readable} from "stream";
import { PublicSlugResolver, StandardResolver } from "../types";
import slugify from "slugify";
import { validate } from "class-validator";
import { ApolloError } from "apollo-server-errors";
import { humanReadableList } from "../helpers";
import { AuthError } from "./auth";
import Location from  "../models/location";
import User from "../models/user";

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
        
    return photos.length > 0 ? photos[0] : null;
}

const uploadFromStream = (s3: any, filename: string): PassThrough => {
    const pass = new PassThrough();
  
    const params = {Bucket: "locofinderutah", Key: `${filename}`, Body: pass, ACL:'public-read'};
    s3.upload(params).promise().then((data: any) => {
        console.log(data);
    }).catch((error: any) => {
        console.log(error);
    });
  
    return pass;
}

const PHOTO_ERROR = 'PHOTO_ERROR';

export const upload: StandardResolver<Promise<Photo|null>> = async (parent, {file, location, width, height, offsetX, offsetY, caption}, {orm, req}) => {
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
        photo.zoom = 1;
        photo.caption = caption;
        photo.created_at = new Date();
        photo.updated_at = new Date();
        photo.slug = slugify(photo.caption+photo.location.title);

        const errors = await validate(photo);

        await orm 
            .manager 
            .getRepository(Photo)
            .save(photo);

        if (errors.length === 0){
            const {createReadStream, filename, mimetype} = await file;
            const stream = createReadStream();
            await new Promise(res => {
                stream.pipe(uploadFromStream(s3, buildPhotoAWSPath(filename, photo.id))).on("close", res)
            });
            
            photo.img_url = filename;
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