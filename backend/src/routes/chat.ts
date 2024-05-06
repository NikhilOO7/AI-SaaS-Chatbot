import { deleteChats, generateChatCompletion, sendChatsToUser } from "@controllers/chats";
import { verifyToken } from "@utils/token-manager";
import { chatCompletionValidator, validate } from "@utils/validators";
import { Router } from "express";

const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);

export default chatRoutes;