import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Connection, In} from "typeorm";
import {EntityRepository, Repository} from "typeorm";
import { getProfileURL } from "../config";
import Photo from "./photo";
import Location from "./location";
import {IsEmail, IsNotEmpty} from "class-validator";


@Entity("users")
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string 

    @Column()
    @IsNotEmpty()
    bio: string

    @Column()
    @IsNotEmpty()
    display: string

    @Column()
    @IsNotEmpty()
    slug: string 

    @Column()
    profile_img: string 

    @Column()
    @IsNotEmpty()
    offsetX: number

    @Column()
    @IsNotEmpty()
    offsetY: number 

    @Column()
    @IsNotEmpty()
    width: number 

    @Column()
    @IsNotEmpty()
    height: number

    @Column()
    @IsNotEmpty()
    zoom: number

    @OneToMany(() => Location, location => location.user)
    @JoinColumn({
        name: "id"
    })
    user: User

    @OneToMany(() => Photo, photo => photo.user)
    @JoinColumn({
        name: "id"
    })
    photos: Photo[]

    profile_url(){
        return getProfileURL(this.id, this.profile_img);
    }

    @Column()
    encrypted_password: string


    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    @Column()
    role: string

    views: number

}



@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async topUsers(orm: Connection) : Promise<User[]> {
        const users = await this
            .createQueryBuilder()
            .leftJoin(Photo, "photos", "photos.user_id = User.id")
            .where("photos.views IS NOT NULL")
            .groupBy("User.id")
            .orderBy("SUM(photos.views)", "DESC")
            .limit(10)
            .getMany(); 

        const photos = await orm 
            .manager
            .connection 
            .getRepository(Photo)
            .find({
                where:{
                    user: In(users.map(u => u.id))
                },
                relations: ["user", "location"],
                order: {
                    views: "DESC"
                }
            });

        const photoMap: Map<number, Photo[]> = new Map();

        photos.forEach(photo => {
            if(!photoMap.get(photo.user.id)?.push(photo)){
                photoMap.set(photo.user.id, [photo]);
            } else if(photoMap.get(photo.user.id)!.length > 6) {
                photoMap.get(photo.user.id)!.pop();
            }
        });



        users.forEach(user => {
            user.photos = photoMap.get(user.id)!;
        });

        return users.filter(u => u.photos);
    }

}