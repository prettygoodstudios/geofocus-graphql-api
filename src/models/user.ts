import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from "typeorm";
import { getProfileURL } from "../config";
import Photo from "./photo";

@Entity("users")
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string 

    @Column()
    bio: string

    @Column()
    display: string

    @Column()
    slug: string 

    @Column()
    profile_img: string 

    @Column()
    offsetX: number

    @Column()
    offsetY: number 

    @Column()
    width: number 

    @Column()
    height: number

    @Column()
    zoom: number

    @OneToMany(() => Photo, photo => photo.user)
    @JoinColumn({
        name: "id"
    })
    photos: Photo[]

    profile_url(){
        return getProfileURL(this.id, this.profile_img);
    }

}