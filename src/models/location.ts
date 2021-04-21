import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToMany, ManyToOne} from "typeorm";
import Photo from "./photo";

@Entity("locations")
export default class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    address: string;

    @Column()
    longitude: number;

    @Column()
    latitude: number;

    @Column()
    user_id: number;

    @Column()
    slug: string;

    @OneToMany(() => Photo, photo => photo.location)
    @JoinColumn({name: "id"})
    photos: Photo[]
}