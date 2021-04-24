import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Connection, In} from "typeorm";
import {EntityRepository, Repository} from "typeorm";
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

    views: number

}



@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async topUsers(orm: Connection) : Promise<User[]> {
        const users = await this
            .createQueryBuilder()
            .leftJoin(Photo, "photos", "photos.user_id = User.id")
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
                relations: ["user"]
            });        

        const photoMap: Map<number, Photo[]> = new Map();

        photos.forEach(photo => {
            if(!photoMap.get(photo.user.id)?.push(photo)){
                photoMap.set(photo.user.id, [photo]);
            }
        });



        users.forEach(user => {
            user.photos = photoMap.get(user.id)!;
        });

        return users;
    }

}