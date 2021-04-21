import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import Location from "./location";

@Entity("photos")
export default class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    caption: string;

    @Column()
    views: number;

    @Column()
    img_url: string

    @ManyToOne(() => Location, location => location.photos)
    @JoinColumn({ name: "location_id" })
    location: Location

    @Column()
    slug: string 

    @Column()
    width: number 

    @Column()
    height: number 

    @Column()
    zoom: number 

    @Column()
    offsetX: number 

    @Column()
    offsetY: number 
}