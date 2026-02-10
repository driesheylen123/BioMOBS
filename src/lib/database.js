import { Database } from "arangojs"

let credentials = {
    "url": import.meta.env.VITE_DB_URL,
    "databaseName": import.meta.env.VITE_DB,
    "auth": { "username": import.meta.env.VITE_USER,
              "password": import.meta.env.VITE_PASSWORD}
}

const db = new Database(credentials);

export default db