import express from "express";
import userRoutes from "./user";
import chatRoutes from "./chat";

const router = express.Router();

router.use('/user', userRoutes);    // route -> domain/api/v1/user
router.use('/chats', chatRoutes);   // route -> domain/api/v1/chats

export default router;