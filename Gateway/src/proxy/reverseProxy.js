import http from "http";

export function proxyRequest(req, res, target){
    const options = {
        hostname: target.host,
        port: target.port,
        path: req.url,
        method: req.method,
        headers: req.headers
    };
    const proxyReq = http.request(options, proxyRes=>{
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on("error", err=>{
        res.status(502).json({msg: "Bad gateway", error: err.message});
    });

    req.pipe(proxyReq);
}