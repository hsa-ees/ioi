CREATE TABLE "account" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "acc_name" varchar UNIQUE,
  "email" varchar UNIQUE,
  "created_at" timestamp,
  "country_code" int,
  "pwd_hashed" varchar,
  "logged_in" boolean,
  "last_login" timestamp
);

CREATE TABLE "character" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
    title varchar,
    account int,
  "skin" varchar,
  "exp_student" int,
  "exp_scholar" int,
  "lvl_student" int,
  "lvl_scholar" int,
  "inventory_id" SERIAL UNIQUE,
  "coins" int,
  "interests" varchar,
  "last_login" timestamp,
  "guest" boolean,
  "online" boolean,
  "data" JSON,
  CONSTRAINT "fk_acc_char" FOREIGN KEY ("account") REFERENCES "account" ("id")
);

CREATE TABLE "subject" (
  "name" varchar UNIQUE,
  "id" SERIAL PRIMARY KEY,
  "description" varchar,
  "parent" int REFERENCES subject(id),
  "child" int REFERENCES subject(id)
);

CREATE TABLE "toolset" (
  "id" SERIAL PRIMARY KEY,
  "tools" JSON
);


CREATE TABLE "island" (
  "id" SERIAL PRIMARY KEY,
  "owner" int REFERENCES character(id),
  "creator" int REFERENCES character(id),
  "parent" int REFERENCES island(id),
  "child" int REFERENCES island(id),
  "size" int,
  initial_start timestamp,
  "max_players" int,
  "current_players" int,
  begin_emptiness timestamp,
  "subject" int
);

CREATE TABLE "items" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "data" JSON
);



CREATE TABLE "building" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "island" int REFERENCES island(id),
  "tileset" varchar,
  "spawnpoint" varchar
);

CREATE TABLE "room" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "description" varchar,
  "jitsi_loc" varchar,
  "toolset" int REFERENCES toolset(id),
  "building" int REFERENCES building(id)
);

CREATE TABLE "achievements" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "description" varchar,
  "precondition" varchar
);



CREATE TABLE "game" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "description" varchar,
  "creator" int,
  "creator_name" varchar,
  "content" JSON,
  "rating" float,
  "ratings" int,
  "exp" int,
  "tags" varchar,
  "times_played" int,
  "level" int
);
CREATE TABLE "character_subjects" (
  "character_id" int,
  "subject" int,
  "mode_scholar" boolean,
  "mode_student" boolean,
  "exp_scholar" int,
  "exp_student" int,
  "lvl_scholar" int,
  "lvl_student" int,
  CONSTRAINT character_subjects_pk PRIMARY KEY (character_id,subject),
  CONSTRAINT fk_character FOREIGN KEY ("character_id") references "character" (id),
  CONSTRAINT fk_subject FOREIGN KEY (subject) references subject (id)

);
CREATE TABLE "instanced_character" (
  "island" int REFERENCES island(id),
  "building" int REFERENCES building(id),
  "room" int REFERENCES room (id),
  "character" int PRIMARY KEY references character(id),
  "ingame" boolean
);
CREATE TABLE "island_subjects" (
  "island" int REFERENCES island(id),
  "subject" int REFERENCES subject(id),
  CONSTRAINT pk_island_subjects PRIMARY KEY (island,subject)
);

CREATE TABLE "character_item" (
  "character_id" int REFERENCES character(id),
  "item" int REFERENCES items(id),
  "quantity" int,
  CONSTRAINT pk_character_item PRIMARY KEY (character_id,item)
);

CREATE TABLE "game_subjects" (
  "game" int REFERENCES game(id),
  "subject" int REFERENCES subject(id),
  CONSTRAINT pk_game_subejcts PRIMARY KEY (game,subject)

);


CREATE TABLE "character_achievement" (
  "character" int REFERENCES character(id),
  "achievement" int REFERENCES achievements(id),
  "progress_points" int,
  CONSTRAINT pk_character_achievement PRIMARY KEY (character,achievement)
);

CREATE TABLE "gaming_character" (
  "game" int REFERENCES game(id),
  "character" int REFERENCES character(id)
);

