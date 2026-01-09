export const services = [
    {
        name: "auth-service",
        prefix: "/auth",
        target: {
            host: "localhost",
            port: 4001
        }

    },
    {
        name: "user-service",
        prefix: "/users",
        target: {
            host: "localhost",
            port: 4002
        }
    },
    {
        name: "test-service",
        prefix: "/test",
        target: {
            host: "localhost",
            port: 8005
        }
    }
]