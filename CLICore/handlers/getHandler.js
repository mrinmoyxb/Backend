import validateURL from "../utils/validateUrl.js";
import createRequestContext from "../core/requestContext.js";
import sendRequest from "../http/httpClient.js"

export default async function handleGet(url){
    if(!validateURL(url)){
        throw new Error("Invalid URL");
    }

    const context = createRequestContext({
        method: "GET",
        url
    });

    try{
        const response = await sendRequest(context);
        return {
            success: true,
            request: context,
            response,
            duration: Date.now() - context.startTime
        };
    }catch(error){
        return{
            success: false,
            error: error.message
        };
    }
}