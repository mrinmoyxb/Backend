import handleGet from "../handlers/getHandler.js";

export default function resolveCommand({method, url}){
    if(!method || !url){
        throw new Error("Method or URL missing");
    }

    switch(method){
        case "GET":
            return handleGet(url);
        default:
            throw new Error(`Unsupported method: ${method}`);
    }
}