import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { getPhotoURL } from "../config";
import Location from "./location";
import User from "./user";

@Entity("photos")
export default class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @Length(2, 255)
    caption: string;

    @Column()
    views: number;

    @Column()
    img_url: string

    @ManyToOne(() => Location, location => location.photos)
    @JoinColumn({ name: "location_id" })
    location: Location

    @Column()
    @IsNotEmpty()
    slug: string 

    @Column()
    @IsNotEmpty()
    width: number 

    @Column()
    @IsNotEmpty()
    height: number 

    @Column()
    @IsNotEmpty()
    zoom: number 

    @Column()
    @IsNotEmpty()
    offsetX: number 

    @Column()
    @IsNotEmpty()
    offsetY: number 

    @Column()
    created_at: Date 

    @Column()
    updated_at: Date

    @ManyToOne(() => User, user => user.photos)
    @JoinColumn({
        name: "user_id"
    })
    user: User

    url(){
        return getPhotoURL(this.id, this.img_url);
    }
}
