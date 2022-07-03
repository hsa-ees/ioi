import { Entity, Column, PrimaryGeneratedColumn, TableForeignKey, ManyToOne } from "typeorm";
import { Account } from "./dbModelAccount";

@Entity()
export class Character {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(()=> Account, (account)=> account.charachters)
    account: Account

    @Column("json")
    data: JSON
} 