import { Router } from "express";
import { setForgotPassword, setLoginUser, setLogoutUser, setNewAccessTokenUser, setNewPassword, setRegisterUser, setVerifyOTP } from "./auth.controller.ts";
import { middlewareAuthenticateRefreshToken } from "./auth.middleware.ts";

const router = Router();

router.post("/register", setRegisterUser);
router.post("/login", setLoginUser);
router.post("/refresh", middlewareAuthenticateRefreshToken, setNewAccessTokenUser);
router.post("/logout", setLogoutUser);
router.post("/forgot-password", setForgotPassword);
router.post("/verify-otp", setVerifyOTP);
router.post("/reset-password", setNewPassword);

export default router;