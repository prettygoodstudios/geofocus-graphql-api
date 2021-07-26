import { Length, IsNotEmpty, Max } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne} from "typeorm";
import Photo from "./photo";
import Review from "./review";
import User from "./user";

const notBlankMessage = (field: string) => `${field} must not be blank.`;
const rangeMessage = (field: string, min: number = 2, max: number = 255) => `${field} must have a character length between ${min} and ${max} characters.`;

@Entity("locations")
export default class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(2, 255)
    @IsNotEmpty()
    title: string;

    @Column()
    @Length(2, 255, {
        message: rangeMessage('City')
    })
    @IsNotEmpty({
        message: notBlankMessage('City')
    })
    city: string;

    @Column()
    @Length(2, 255, {
        message: rangeMessage('State')
    })
    @IsNotEmpty({
        message: notBlankMessage('State')
    })
    state: string;

    @Column()
    @Length(2, 255, {
        message: rangeMessage('Country')
    })
    country: string;

    @Column()
    @IsNotEmpty()
    created_at: Date;

    @Column()
    @IsNotEmpty()
    updated_at: Date;

    @Column()
    @Length(2, 255, {
        message: rangeMessage('Address')
    })
    @IsNotEmpty({
        message: notBlankMessage('Address')
    })
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
    @JoinColumn({name: "user_id"})
    user: User

    @Column()
    @IsNotEmpty()
    slug: string;

    @OneToMany(() => Photo, photo => photo.location)
    @JoinColumn({name: "id"})
    photos: Photo[]

    @OneToMany(() => Review, review => review.location)
    @JoinColumn({name: "id"})
    reviews: Review[]

    humanReadableAddress(){
        return `${this.address}, ${this.city}, ${this.state}, ${this.country}`;
    }
}