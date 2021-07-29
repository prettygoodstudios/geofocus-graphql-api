import { PassThrough } from "stream";
import { s3 } from "./config";


const uploadFromStream = (s3: any, filename: string, res: (value: any) => void): PassThrough => {
    const pass = new PassThrough();
  
    const params = {Bucket: "locofinderutah", Key: `${filename}`, Body: pass, ACL:'public-read'};
    s3.upload(params).promise().then((data: any) => {
        res(data);
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
        stream.pipe(uploadFromStream(s3, pathGenerater(filename, id), res));
    });
    return filename;
}

export const deleteFromS3 = (filename: string) => {
    const params = {Bucket: "locofinderutah", Key: `${filename}`};
    s3.deleteObject(params).promise().then((data: any) => {
        console.log(data);
    }).catch((error: any) => {
        console.log(error);
    });
}