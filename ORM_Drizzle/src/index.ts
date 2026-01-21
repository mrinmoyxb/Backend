import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { userTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main(){
    const user: typeof userTable.$inferInsert = {
        name: "Kenedy",
        age: 31,
        email: "ken@mail.com"
    };

    await db.insert(userTable).values(user);
    console.log('New user created!');
}

async function fetchUsers(){
    const user = await db.select().from(userTable);
    console.log("Getting all users from database: \n", user);
}

fetchUsers();