import { Length, IsNotEmpty } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from "typeorm";
import Photo from "./photo";

@Entity("locations")
export default class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(2, 255)
    title: string;

    @Column()
    @Length(2, 255)
    city: string;

    @Column()
    @Length(2, 255)
    state: string;

    @Column()
    @Length(2, 255)
    country: string;

    @Column()
    @IsNotEmpty()
    created_at: Date;

    @Column()
    @IsNotEmpty()
    updated_at: Date;

    @Column()
    @Length(2, 255)
    address: string;

    @Column()
    @IsNotEmpty()
    longitude: number;

    @Column()
    @IsNotEmpty()
    latitude: number;

    @Column()
    @IsNotEmpty()
    user_id: number;

    @Column()
    @IsNotEmpty()
    slug: string;

    @OneToMany(() => Photo, photo => photo.location)
    @JoinColumn({name: "id"})
    photos: Photo[]

    humanReadableAddress(){
        return `${this.address}, ${this.city}, ${this.state}, ${this.country}`;
    }
}