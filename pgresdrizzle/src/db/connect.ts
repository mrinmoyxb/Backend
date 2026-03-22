import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

export default function connectToDB(){
    try{
        const pool = new Pool({
            connectionString: "postgresql://admin:admin@localhost:5434/testdb"
        });
        const db = drizzle(pool);
        console.log("Connected to Postgres ✅");
        return db;
    }catch(error){
        console.log("Couldn't connect to Postgres");
    }
}
