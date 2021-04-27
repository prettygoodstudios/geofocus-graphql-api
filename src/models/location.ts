import { Length, IsNotEmpty } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne} from "typeorm";
import Photo from "./photo";
import User from "./user";

@Entity("locations")
export default class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(2, 255)
    @IsNotEmpty()
    title: string;

    @Column()
    @Length(2, 255)
    @IsNotEmpty()
    city: string;

    @Column()
    @Length(2, 255)
    @IsNotEmpty()
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
    @IsNotEmpty()
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

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: "id"})
    user: User

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