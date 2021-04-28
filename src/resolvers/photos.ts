import { s3 } from "../config";
import Photo from "../models/photo";
import {PassThrough, Readable} from "stream";
import { PublicSlugResolver, StandardResolver } from "../types";

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

function uploadFromStream(s3: any) {
    var pass = new PassThrough();
  
    var params = {Bucket: "locofinderutah", Key: "testingtesting", Body: pass};
    s3.upload(params, function(err: any, data: any) {
        console.log("Testin Testing")
        console.log(err, data);
    });
  
    return pass;
  }

export const upload: StandardResolver<Promise<Photo|null>> = async (parent, {file}, {orm}) => {
    
    
    const {createReadStream, filename, mimetype} =   await file;

    const pass = new PassThrough();
    const stream: Readable = createReadStream();
    console.log("Start")
    stream.pipe(uploadFromStream(s3));
    console.log("After")
    return null;
}