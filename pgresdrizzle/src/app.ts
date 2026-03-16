import Fastify from "fastify";
import { drizzle } from "drizzle-orm/singlestore";
import { usersTable } from "./db/users"; 

const db = drizzle("");

const fastify = Fastify({logger: false});

fastify.get("/home", async(req, res)=>{
    return {msg: "Welcome to test homepage"};
})

fastify.get("/users", async (req, res)=>{

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
                            name: {type: "string"},
                            age: {type: "number"}
                        }
                    }
                }
            },
            400: {
                type: "object",
                properties: {
                    message: {type: "string"}
                }
            }
        }
    },
},
    async (req, res)=>{
        return {user: req.body, msg:"done"};
})

try{
    await fastify.listen({port: 3000, host: "0.0.0.0"});
}catch(error){
    fastify.log.error(error);
    process.exit(1);
}