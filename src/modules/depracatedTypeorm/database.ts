import "reflect-metadata"
import { DataSource } from "typeorm"
import { Photo } from "./models/dbModelPhoto"
import { Character} from "./models/dbModelCharacter"
import { Account } from "./models/dbModelAccount"

require('dotenv').config()


export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, 
    entities: [Photo,Account,Character],
    synchronize: true,
    logging: false,
})