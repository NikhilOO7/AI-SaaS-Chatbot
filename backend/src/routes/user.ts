import { getAllUsers,
    userLogin,
    userLogout,
    userSignup,
    verifyUser, 
} from "@controllers/user";
import {
    loginValidator,
    signupValidator,
    validate,
  } from "@utils/validators";
  import { verifyToken } from "@utils/token-manager";
  

import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;