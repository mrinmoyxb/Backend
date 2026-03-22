import Fastify from "fastify";
import connectToDB from "./db/connect";
import usersTable from "./db/users";

const fastify = Fastify({logger: false});
fastify.register(require('@fastify/formbody'))
const db = connectToDB();

fastify.get("/home", async(req, res)=>{
    return {msg: "Welcome to test homepage"};
})

fastify.get("/users", async (req, res)=>{
    const result = await db?.select().from(usersTable);
    return {"msg": result};
})

fastify.post("/adduser", {
    schema: {
        body: {
            type: "object",
            required: ["id", "username", "email", "password"],
            properties: {
                id: {type: "number"},
                username: {type: "string"},
                email: {type: "string"},
                password: {type: "string"}
            }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    user: {
                        type: "object",
                        properties: {
                            user: {type: "string"},
                            msg: {type: "number"}
                        }
                    }
                }
            }
        }
    },
},
    async (req, res)=>{
        const {id, username, email, password} = req.body as {
            id: number, username: string, email: string, password: string
        }
        const result = await db?.insert(usersTable)
                .values({id: id, username: username, email: email, password: password})
                .returning();
        return {user: username, msg:"done"};
})

try{
    await fastify.listen({port: 3000, host: "0.0.0.0"});
    console.log("Connected to server ✅");
}catch(error){
    fastify.log.error(error);
    process.exit(1);
}