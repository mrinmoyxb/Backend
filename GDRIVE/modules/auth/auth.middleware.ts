import type { Request, Response, NextFunction } from "express";
import { utilGetAccessToken, utilHashRefreshToken, utilVerifyAccessToken, utilVerifyRefreshToken } from "../../utils/authUtil.js";
import { userModel } from "../users/user.model.js";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function middlewareAuthenticateAccessToken(req: AuthenticatedRequest, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({msg: "missing access token"});
        }

        const authParts = authHeader.split(" ");
        if(authParts.length!==2 || !authParts[1]){
            return res.status(401).json({msg: "invalid authorization header"});
        }

        const decodedToken = utilVerifyAccessToken(authParts[1]) as any;
        if(!decodedToken.userid){
            return res.status(401).json({ msg: "invalid access token payload" });
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

        const decodedToken = utilVerifyRefreshToken(refreshToken) as any;
        if(!decodedToken.userid){
            return res.status(401).json({msg: "invalid refresh token payload"});
        }

        const hashedToken = await utilHashRefreshToken(refreshToken);
        const user = await userModel.findById({id: decodedToken._id});
        if(hashedToken === user?.refreshToken){
            req.userId = decodedToken.userid;
            next();
        }else{
            return res.status(400).json({msg: "invalid refresh token"});
        }
    }catch(error){
        return res.status(403).json({msg: "invalid or expired refresh token"});
    }
}