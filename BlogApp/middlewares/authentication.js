import validateToken from "../services/authenticate.js";

export default function checkForAuthenticationCookie(cookieName){
    return (req, res, next)=>{
        try{
            const tokenCookieValue = req.cookies[cookieName];
            if(!tokenCookieValue){
                next();
            }else{
                const userPayload = validateToken(tokenCookieValue);
                req.user = userPayload;
                next();
            }
        }catch(error){
            console.log("ERROR: ", error)
        }
    }
}