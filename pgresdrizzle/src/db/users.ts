import { pgTable, integer, varchar } from "drizzle-orm/pg-core"

const usersTable = pgTable("users", {
    id: integer().primaryKey(),
    username: varchar().notNull(),
    email: varchar().notNull().unique(),
    password: varchar().notNull()
});

export default usersTable;