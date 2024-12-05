import { Router } from "express";
import { createAccount } from "../controller/userController";
import { loginAccount } from "../controller/userController";
import { readOneAccont } from "../controller/userController";
import { readAllAccount } from "../controller/userController";
import { forgetPassword } from "../controller/userController";
import { verifyAccount } from "../controller/userController";
import { changeAccountPassword } from "../controller/userController";

const router: any = Router();

router.route("/create-account").post(createAccount);
router.route("/login").post(loginAccount);
router.route("/read-one-account/:userID").get(readOneAccont);
router.route("/read-all-account").get(readAllAccount);
router.route("/forget-password").patch(forgetPassword);
router.route("/verify-account/:userID").get(verifyAccount);
router.route("/reset-password/:userID").patch(changeAccountPassword);

export default router;
