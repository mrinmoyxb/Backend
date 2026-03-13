import Fastify from "fastify";
import formbody from "@fastify/formbody"

const fastify = Fastify({logger: true});

fastify.register(formbody);

let users = []

fastify.post("/users", async (request, reply) => {
    const user = request.body;
    users.push(user);
    return user;
})

fastify.get("/users", async () => {
    return users;
})

fastify.get("/users/:id", async (request) => {
    return users[request.params.id];
})

fastify.delete("/users/:id", async (request) => {
    users.splice(request.params.id, 1);
    return { deleted: true }
})

fastify.listen({port: 3000}, (err, address) => {
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is running at: ${address}`);
})