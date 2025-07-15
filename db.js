import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect()
    .catch((err) => {
        console.log("Database Connection Failed", err);
    });


const event_table_query = `
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        datetime TIMESTAMP WITH TIME ZONE NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER NOT NULL CHECK (capacity BETWEEN 1 AND 1000)
    );
`;

const user_table_query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    );
`;

const event_registrations_table_query = `
    CREATE TABLE IF NOT EXISTS event_registrations(
        event_id INTEGER NOT NULL REFERENCES events(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        PRIMARY KEY (event_id, user_id)
    );
`;


try{
    await db.query(event_table_query);
    await db.query(user_table_query);
    await db.query(event_registrations_table_query);
}
catch(err) {
    console.log("Tables Creation Failed", err);
}

export default db;