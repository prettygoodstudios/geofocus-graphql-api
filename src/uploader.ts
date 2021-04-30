import { PassThrough } from "stream";
import { s3 } from "./config";

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

export type PathGenerator = (filename: string, id: number) => string;

export const uploadToS3 = async (file: Promise<any>, pathGenerater: PathGenerator, id: number) => {
    const {createReadStream, filename, mimetype} = await file;
    const stream = createReadStream();
    await new Promise(res => {
        stream.pipe(uploadFromStream(s3, pathGenerater(filename, id))).on("close", res)
    });
    return filename;
}