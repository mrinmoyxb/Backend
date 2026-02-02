import { Router } from "express";
import { setCreateNewFolder, setFileStarred, setFileTrashed, setFileUploadConfirmation, setFileUploadToS3 } from "./file.controller.ts";
import { middlewareAuthenticateAccessToken } from "../auth/auth.middleware.ts";

const router = Router();

router.post("/test", (req, res)=>{
    res.status(200).json({msg: "file upload test"});
})
router.post("/upload-intent", middlewareAuthenticateAccessToken, setFileUploadToS3);
router.post("/upload-status", middlewareAuthenticateAccessToken, setFileUploadConfirmation);
router.patch("/starred/:id", middlewareAuthenticateAccessToken, setFileStarred);
router.patch("/trashed/:id", middlewareAuthenticateAccessToken, setFileTrashed);
router.patch("/create-folder", middlewareAuthenticateAccessToken, setCreateNewFolder);

export default router;