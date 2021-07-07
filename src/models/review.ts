import { Length, IsNotEmpty, IsNumber, Min, Max } from "class-validator";
import slugify from "slugify";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne} from "typeorm";
import Location from "./location";
import User from "./user";

@Entity("reviews")
export default class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Max(10)
    score: number;

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

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: "user_id"})
    user: User 

    slug(){
        return slugify(`${this.message.slice(0, 10)} ${this.user.slug} ${this.location.slug}`, {strict: true, lower: true});
    } 
}