import { services } from "./services.js";

export function resolveService(path){
    return services.find(service=>
        path.startsWith(service.prefix)
    )
}