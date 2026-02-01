import { Router } from "express";
import { setFileUploadConfirmation, setFileUploadToS3 } from "./file.controller.ts";
import { middlewareAuthenticateAccessToken } from "../auth/auth.middleware.ts";

const router = Router();

router.post("/test", (req, res)=>{
    res.status(200).json({msg: "file upload test"});
})
router.post("/upload-intent", middlewareAuthenticateAccessToken, setFileUploadToS3);
router.post("/upload-status", middlewareAuthenticateAccessToken, setFileUploadConfirmation);

export default router;