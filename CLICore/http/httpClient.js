import axios from "axios";

export default async function sendRequest(context){
    const response = await axios({
        method: context.method,
        url: context.url,
        headers: context.headers
    });

    return {
        status: response.status,
        headers: response.headers,
        data: response.data
    }
}