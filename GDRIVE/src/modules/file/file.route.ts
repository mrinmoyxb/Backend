import { Router } from "express";
import { setCreateNewFolder, setFileStarred, setFileTrashed, setFileUploadConfirmation, setFileUploadToS3, setRenameItem } from "./file.controller.ts";
import { middlewareAuthenticateAccessToken } from "../auth/auth.middleware.ts";

const router = Router();

router.post("/upload-intent", middlewareAuthenticateAccessToken, setFileUploadToS3);
router.post("/upload-status", middlewareAuthenticateAccessToken, setFileUploadConfirmation);

router.patch("/starred/:id", middlewareAuthenticateAccessToken, setFileStarred);
router.patch("/trashed/:id", middlewareAuthenticateAccessToken, setFileTrashed);
router.patch("/restore/:id");

router.post("/rename-item/:id", middlewareAuthenticateAccessToken, setRenameItem);
router.post("/create-folder", middlewareAuthenticateAccessToken, setCreateNewFolder);

export default router;