import { Router } from "express";
import { setLoginUser, setNewAccessTokenUser, setRegisterUser } from "./auth.controller.ts";
import { middlewareAuthenticateRefreshToken } from "./auth.middleware.ts";

const router = Router();

router.post("/register", setRegisterUser);
router.post("/login", setLoginUser);
router.post("/refresh", middlewareAuthenticateRefreshToken, setNewAccessTokenUser);
//router.post("/logout");
// router.post("/me");

export default router;