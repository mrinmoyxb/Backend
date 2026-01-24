import type { Request, Response, NextFunction } from "express";
import { utilGetAccessToken, utilVerifyAccessToken, utilVerifyRefreshToken } from "../../utils/authUtil.js";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export async function middlewareAuthenticateAccessToken(req: AuthenticatedRequest, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({msg: "missing access token"});
        }

        const authParts = authHeader.split(" ");
        if(authParts.length!==2 || !authParts[1]){
            return res.status(401).json({msg: "invalid authorization header"});
        }

        const decodedToken = await utilVerifyAccessToken(authParts[1]) as any;
        if(!decodedToken.userid){
            return res.status(401).json({ msg: "invalid token payload" });
        }

        req.userId = decodedToken.userid;
        next();
    }catch(error){
        return res.status(403).json({msg: "invalid or expired access token"});
    }
}

export async function middlewareAuthenticateRefreshToken(req: AuthenticatedRequest, res: Response, next: NextFunction){
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({msg: "missing refresh token"});
        }

        const decodedToken = await utilVerifyRefreshToken(refreshToken) as any;
        if(!decodedToken.userid || !decodedToken.useremail){
            return res.status(401).json({ msg: "invalid token payload" });
        }
        const user = {_id: decodedToken.userid, email: decodedToken.useremail};
        const newAccessToken = utilGetAccessToken(user.email, user._id);
        return res.json({
            accessToken : newAccessToken
        })
        next();
    }catch(error){
        return res.status(403).json({msg: "invalid or expired refresh token"});
    }
}