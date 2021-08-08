import * as NodeGeocoder from "node-geocoder";
import * as AWS from "aws-sdk";
import { PathGenerator } from "./uploader";
import {genSaltSync} from "bcrypt";
import {config} from "dotenv";

config();

const S3_BUCKET = process.env.S3_BUCKET as string;
const PROFILE_BUCKET = process.env.PROFILE_BUCKET as string;
const PHOTO_BUCKET = process.env.PHOTO_BUCKET as string;

export const SALT = () =>  genSaltSync(parseInt(process.env.SALT_ROUNDS as string), process.env.SALT_MINOR);

export const buildPhotoAWSPath: PathGenerator = (filename: string, id: number): string => {
    return `uploads/${PHOTO_BUCKET}${id}/${filename}`;
}

export const buildProfileAWSPath: PathGenerator = (filename: string, id: number): string => {
    return `uploads/${PROFILE_BUCKET}${id}/${filename}`;
}

const getAWSFriendlyURL = (url: string): string => {
    return url.replace('"', '').replace("/", "").replace("\"", "");
}

export const getProfileURL = (id: number, url: string): string => {
    return `${S3_BUCKET}${PROFILE_BUCKET}${id}/${getAWSFriendlyURL(url)}`
}

export const getPhotoURL = (id: number, url: string): string => {
    return `${S3_BUCKET}${PHOTO_BUCKET}${id}/${getAWSFriendlyURL(url)}`
}

const options: NodeGeocoder.GenericOptions = {
  provider: process.env.MAP_PROVIDER as NodeGeocoder.Providers,
  apiKey: process.env.MAP_KEY as string, // for Mapquest, OpenCage, Google Premier
};

export const geocoder = NodeGeocoder(options);

export const SECRET = process.env.SECRET as string;

// S3 Config
AWS.config.update({region: process.env.AWS_REGION as string});
AWS.config.update({credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string
}})

export const s3 = new AWS.S3({apiVersion: process.env.AWS_VERSION});
