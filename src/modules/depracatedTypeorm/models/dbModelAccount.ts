import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Character } from "./dbModelCharacter"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "varchar",
        nullable: true
    })
    full_name: string

    @Column({
        unique: true
    })
    acc_name: string

    @Column({
        type: "varchar",
        nullable: true
    })
    email: string

    @Column()
    password: string

    @Column({
        type:"datetime",
        nullable: true })
    last_login: Date

    @OneToMany(()=> Character, (character) => character.account)
    charachters: Character[]
}