// Im Ordner models werden die DB Modelle ( quasi die Tables erstellt)
// Einfach dem Muster Photo folgen, ist selbsterklärend.
// Bitte in der database.ts bei entities[] hinzufügen

// AppDataSource Import immer notwendig, über ihn stellt man die Verbindung zur DB her
import { AppDataSource } from './database';

// Import der Klasse mit der du arbeiten willst, hier z.b. Photo
import { Photo } from './models/dbModelPhoto';

//Initialisierung der DB
AppDataSource.initialize()
    .then(() => {
		//Ab hier steht die verbindung und es kann gearbeitet werden
        async function test() {
                const photo = new Photo()
                photo.name = "Me and Test"
                photo.description = "I am near polar test"
                photo.filename = "photo-with-test.jpg"
                photo.views = 22
                photo.isPublished = true
        
                await AppDataSource.manager.save(photo)
                console.log("Photo has been saved. Photo id is", photo.id)
            
        }
        test()
        
    })
    .catch((error) => console.log(error))