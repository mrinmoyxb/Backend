import { proxyRequest } from "../proxy/reverseProxy.js";
import { resolveService } from "../registry/resolver.js";

export function gatewayMiddleware(req, res){
    const service = resolveService(req.url);

    if(!service){
        return res.status(404).json({msg: "Service not found"});
    }

    proxyRequest(req, res, service.target);
}