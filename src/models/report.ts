import { Length, IsNotEmpty} from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from "typeorm";
import Location from "./location";
import Review from "./review";
import Photo from "./photo";

@Entity("reports")
export default class Report {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(6, 1000)
    @IsNotEmpty()
    message: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
    
    @ManyToOne(() => Location, location => location.id)
    @JoinColumn({name: "location_id"})
    location: Location 

    @ManyToOne(() => Review, review => review.id)
    @JoinColumn({name: "review_id"})
    review: Review
    
    @ManyToOne(() => Photo, photo => photo.id)
    @JoinColumn({name: "photo_id"})
    photo: Photo
}
