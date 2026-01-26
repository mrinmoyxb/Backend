import { Router } from "express";
import { setRegisterUser } from "./auth.controller.ts";

const router = Router();

router.post("/register", setRegisterUser);
// router.post("/login");
// router.post("/logout");
// router.post("/me");

export default router;