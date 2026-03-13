import Fastify from "fastify";

const fastify = Fastify({logger: true});

fastify.addHook("onRequest", async (request, reply) => {
    console.log("request received: middleware at fastify");
})

fastify.get("/", async (request, reply) => {
    return {msg: "hello from fastify server"};
})

fastify.post("/user", async (request, reply) => {
    const name = request.name;
    const email = request.email;
    const password = request.password;

    return {name, email, password};
})

fastify.post("/user/x", {
    schema: {
        body: {
            type: "object",
            required: ["name"],
            properties: {
                name: {type: "string"},
                age: {type: "number"}
            }
        }
    }
}, async (request, reply)=>{
    return {user: request.body};
})

fastify.listen({port: 3000}, (err, address)=>{
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is running at: ${address}`);
})