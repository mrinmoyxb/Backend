export default function createRequestContext({method, url}){
    const requestObject = {
        method,
        url,
        headers: {},
        query: {},
        startTime: Date.now()
    };
    return requestObject;
}